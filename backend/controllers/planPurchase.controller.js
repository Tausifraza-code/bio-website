const crypto = require("crypto");
const mongoose = require("mongoose");
const Plan = require("../models/Plan");
const PlanPurchase = require("../models/PlanPurchase");
const razorpay = require("../config/razorpay");

const createPlanOrder = async (req, res) => {
  try {
    const { planId } = req.body;

    // Validate plan ID
    if (!mongoose.Types.ObjectId.isValid(planId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid plan ID",
      });
    }

    // Fetch plan from database
    const plan = await Plan.findOne({
      _id: planId,
      isActive: true,
    });

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: "Plan not found or currently unavailable",
      });
    }

    if (!Number.isFinite(plan.price) || plan.price <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid plan price",
      });
    }

    // Razorpay accepts amounts in paise for INR
    const amountInPaise = Math.round(plan.price * 100);

    // Create order on Razorpay
    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: `plan_${Date.now()}`,
      notes: {
        planId: plan._id.toString(),
        userId: req.user._id.toString(),
      },
    });

    // Save pending purchase in MongoDB
    const purchase = await PlanPurchase.create({
      userId: req.user._id,
      planId: plan._id,
      planName: plan.name,
      amount: plan.price,
      durationValue: plan.durationValue,
      durationUnit: plan.durationUnit,
      status: "pending",
      razorpayOrderId: order.id,
    });

    return res.status(201).json({
      success: true,
      message: "Razorpay order created successfully",
      data: {
        purchaseId: purchase._id,
        planName: plan.name,
        amount: plan.price,
        currency: "INR",
        razorpayKeyId: process.env.RAZORPAY_KEY_ID,
        orderId: order.id,
        orderAmount: order.amount,
        orderCurrency: order.currency,
        status: purchase.status,
      },
    });
  } catch (error) {
    console.error(
      "Create plan order error:",
      error.error?.description || error.message,
    );

    return res.status(500).json({
      success: false,
      message: "Unable to create payment order",
    });
  }
};

// Verify Razorpay payment
const verifyPlanPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Payment verification details are required",
      });
    }

    // Find the purchase belonging to the logged-in user
    const purchase = await PlanPurchase.findOne({
      razorpayOrderId: razorpay_order_id,
      userId: req.user._id,
    });

    if (!purchase) {
      return res.status(404).json({
        success: false,
        message: "Purchase not found",
      });
    }

    // Do not process an already-paid purchase again
    if (purchase.status === "paid") {
      return res.status(409).json({
        success: false,
        message: "This purchase has already been paid",
      });
    }

    if (purchase.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "This purchase is not pending",
      });
    }

    // Generate signature using the order ID stored on our server
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${purchase.razorpayOrderId}|${razorpay_payment_id}`)
      .digest("hex");

    // Constant-time signature comparison
    const received = Buffer.from(razorpay_signature, "hex");
    const expected = Buffer.from(generatedSignature, "hex");

    if (
      received.length !== expected.length ||
      !crypto.timingSafeEqual(received, expected)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      });
    }

    // Verify payment details with Razorpay itself
    const payment = await razorpay.payments.fetch(razorpay_payment_id);

    if (
      payment.order_id !== purchase.razorpayOrderId ||
      payment.amount !== Math.round(purchase.amount * 100) ||
      payment.currency !== "INR" ||
      !["authorized", "captured"].includes(payment.status)
    ) {
      return res.status(400).json({
        success: false,
        message: "Payment details do not match this purchase",
      });
    }

    // This example requires captured payment before activation.
    if (payment.status !== "captured") {
      return res.status(409).json({
        success: false,
        message: "Payment is not captured yet. Please retry verification.",
      });
    }

    const now = new Date();
    const expiryDate = new Date(now);

    if (purchase.durationUnit === "days") {
      expiryDate.setDate(expiryDate.getDate() + purchase.durationValue);
    } else if (purchase.durationUnit === "months") {
      expiryDate.setMonth(expiryDate.getMonth() + purchase.durationValue);
    } else {
      expiryDate.setFullYear(expiryDate.getFullYear() + purchase.durationValue);
    }

    // Conditional update prevents duplicate activation
    const updatedPurchase = await PlanPurchase.findOneAndUpdate(
      {
        _id: purchase._id,
        status: "pending",
      },
      {
        $set: {
          status: "paid",
          razorpayPaymentId: razorpay_payment_id,
          purchaseDate: now,
          expiryDate,
        },
      },
      { returnDocument: "after" },
    );

    if (!updatedPurchase) {
      return res.status(409).json({
        success: false,
        message: "Purchase has already been processed",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Payment verified and purchase activated",
      data: {
        purchaseId: updatedPurchase._id,
        planName: updatedPurchase.planName,
        amount: updatedPurchase.amount,
        status: updatedPurchase.status,
        purchaseDate: updatedPurchase.purchaseDate,
        expiryDate: updatedPurchase.expiryDate,
      },
    });
  } catch (error) {
    console.error(
      "Payment verification error:",
      error.error?.description || error.message,
    );

    return res.status(500).json({
      success: false,
      message: "Unable to verify payment right now",
    });
  }
};

const getAllPlanPurchases = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search = "", from, to } = req.query;

    const pageNumber = Math.max(1, Number(page) || 1);
    const pageSize = Math.min(100, Math.max(1, Number(limit) || 10));

    const filter = {};

    // Filter by payment status
    const allowedStatuses = [
      "pending",
      "paid",
      "failed",
      "cancelled",
      "refunded",
    ];

    if (status) {
      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid purchase status",
        });
      }

      filter.status = status;
    }

    // Filter by order creation date
    if (from || to) {
      filter.createdAt = {};

      if (from) {
        const fromDate = new Date(from);

        if (Number.isNaN(fromDate.getTime())) {
          return res.status(400).json({
            success: false,
            message: "Invalid start date",
          });
        }

        filter.createdAt.$gte = fromDate;
      }

      if (to) {
        const toDate = new Date(to);

        if (Number.isNaN(toDate.getTime())) {
          return res.status(400).json({
            success: false,
            message: "Invalid end date",
          });
        }

        toDate.setHours(23, 59, 59, 999);
        filter.createdAt.$lte = toDate;
      }
    }

    // Search by plan name, order ID, or user details
    const keyword = search.trim();

    if (keyword) {
      const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

      const matchingUsers = await require("../models/User")
        .find({
          $or: [
            { fullName: { $regex: escapedKeyword, $options: "i" } },
            { email: { $regex: escapedKeyword, $options: "i" } },
            { phone: { $regex: escapedKeyword, $options: "i" } },
          ],
        })
        .select("_id")
        .limit(500)
        .lean();

      const searchConditions = [
        { planName: { $regex: escapedKeyword, $options: "i" } },
        { razorpayOrderId: { $regex: escapedKeyword, $options: "i" } },
        { razorpayPaymentId: { $regex: escapedKeyword, $options: "i" } },
      ];

      if (matchingUsers.length > 0) {
        searchConditions.push({
          userId: {
            $in: matchingUsers.map((user) => user._id),
          },
        });
      }

      filter.$or = searchConditions;
    }

    const [purchases, total] = await Promise.all([
      PlanPurchase.find(filter)
        .select(
          "userId planId planName amount durationValue durationUnit status razorpayOrderId razorpayPaymentId purchaseDate expiryDate createdAt",
        )
        .populate("userId", "fullName email phone")
        .populate("planId", "name price")
        .sort({ createdAt: -1, _id: -1 })
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize)
        .lean(),

      PlanPurchase.countDocuments(filter),
    ]);

    // Overall statistics, independent of search and filters
    const [statsResult] = await PlanPurchase.aggregate([
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          paidOrders: {
            $sum: {
              $cond: [{ $eq: ["$status", "paid"] }, 1, 0],
            },
          },
          pendingOrders: {
            $sum: {
              $cond: [{ $eq: ["$status", "pending"] }, 1, 0],
            },
          },
          paidRevenue: {
            $sum: {
              $cond: [{ $eq: ["$status", "paid"] }, "$amount", 0],
            },
          },
        },
      },
    ]);

    const stats = statsResult || {
      totalOrders: 0,
      paidOrders: 0,
      pendingOrders: 0,
      paidRevenue: 0,
    };

    return res.status(200).json({
      success: true,
      data: purchases,
      stats,
      pagination: {
        total,
        page: pageNumber,
        limit: pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.error("Get plan purchases error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch purchase history",
    });
  }
};

const exportPlanPurchases = async (req, res) => {
  try {
    const { status, search = "", from, to } = req.query;

    const filter = {};
    const allowedStatuses = [
      "pending",
      "paid",
      "failed",
      "cancelled",
      "refunded",
    ];

    // Payment status filter
    if (status) {
      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid order status.",
        });
      }

      filter.status = status;
    }

    // Date range filter — same createdAt field as order history
    if (from || to) {
      filter.createdAt = {};

      if (from) {
        const fromDate = new Date(`${from}T00:00:00.000`);
        if (Number.isNaN(fromDate.getTime())) {
          return res.status(400).json({
            success: false,
            message: "Invalid start date.",
          });
        }
        filter.createdAt.$gte = fromDate;
      }

      if (to) {
        const toDate = new Date(`${to}T23:59:59.999`);
        if (Number.isNaN(toDate.getTime())) {
          return res.status(400).json({
            success: false,
            message: "Invalid end date.",
          });
        }
        filter.createdAt.$lte = toDate;
      }

      if (
        filter.createdAt.$gte &&
        filter.createdAt.$lte &&
        filter.createdAt.$gte > filter.createdAt.$lte
      ) {
        return res.status(400).json({
          success: false,
          message: "Start date cannot be after end date.",
        });
      }
    }

    // Search by customer, plan, or Razorpay ID
    const keyword = search.trim();

    if (keyword) {
      const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

      const User = require("../models/User");

      const matchingUsers = await User.find({
        $or: [
          { fullName: { $regex: escapedKeyword, $options: "i" } },
          { email: { $regex: escapedKeyword, $options: "i" } },
          { phone: { $regex: escapedKeyword, $options: "i" } },
        ],
      })
        .select("_id")
        .limit(500)
        .lean();

      const searchConditions = [
        { planName: { $regex: escapedKeyword, $options: "i" } },
        { razorpayOrderId: { $regex: escapedKeyword, $options: "i" } },
        { razorpayPaymentId: { $regex: escapedKeyword, $options: "i" } },
      ];

      if (matchingUsers.length) {
        searchConditions.push({
          userId: { $in: matchingUsers.map((user) => user._id) },
        });
      }

      filter.$or = searchConditions;
    }

    // Intentionally no skip() or limit():
    // export every matching order, not just the current page.
    const purchases = await PlanPurchase.find(filter)
      .select(
        "userId planId planName amount durationValue durationUnit status razorpayOrderId razorpayPaymentId purchaseDate expiryDate createdAt",
      )
      .populate("userId", "fullName email phone")
      .populate("planId", "name price")
      .sort({ createdAt: -1, _id: -1 })
      .lean();

    const rows = purchases.map((order) => ({
      orderId: order._id?.toString() || "",
      customerName: order.userId?.fullName || "Unknown user",
      customerEmail: order.userId?.email || "",
      customerPhone: order.userId?.phone || "",
      planName: order.planName || order.planId?.name || "",
      amount: order.amount ?? 0,
      duration: `${order.durationValue ?? ""} ${
        order.durationUnit ?? ""
      }`.trim(),
      status: order.status || "",
      purchaseDate: order.purchaseDate || "",
      expiryDate: order.expiryDate || "",
      createdAt: order.createdAt || "",
      razorpayOrderId: order.razorpayOrderId || "",
      razorpayPaymentId: order.razorpayPaymentId || "",
    }));

    return res.status(200).json({
      success: true,
      count: rows.length,
      data: rows,
    });
  } catch (error) {
    console.error("Export plan purchases error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to export orders.",
    });
  }
};

module.exports = {
  createPlanOrder,
  verifyPlanPayment,
  getAllPlanPurchases,
  exportPlanPurchases,
};
