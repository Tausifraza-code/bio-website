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
    const { page = 1, limit = 10, status } = req.query;

    const pageNumber = Math.max(1, Number(page) || 1);
    const pageSize = Math.min(100, Math.max(1, Number(limit) || 10));

    const filter = {};

    if (status) {
      const allowedStatuses = [
        "pending",
        "paid",
        "failed",
        "cancelled",
        "refunded",
      ];

      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid purchase status",
        });
      }

      filter.status = status;
    }

    const [purchases, total] = await Promise.all([
      PlanPurchase.find(filter)
        .populate("userId", "name email")
        .populate("planId", "name price")
        .sort({ createdAt: -1 })
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize)
        .select("-__v"),

      PlanPurchase.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      data: purchases,
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

module.exports = { createPlanOrder, verifyPlanPayment, getAllPlanPurchases };
