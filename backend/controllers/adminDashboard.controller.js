const User = require("../models/User");
const ReferralLog = require("../models/ReferralLog");
const Plan = require("../models/Plan");
const PlanPurchase = require("../models/PlanPurchase");

// GET /api/admin/dashboard
const getAdminDashboard = async (req, res) => {
  try {
    const { from, to } = req.query;

    // Validate date range
    const isValidDate = (value) => {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(value || "")) {
        return false;
      }

      const date = new Date(`${value}T00:00:00Z`);

      return (
        !Number.isNaN(date.getTime()) &&
        date.toISOString().slice(0, 10) === value
      );
    };

    if (!isValidDate(from) || !isValidDate(to)) {
      return res.status(400).json({
        success: false,
        message: "Valid from and to dates are required.",
      });
    }

    if (from > to) {
      return res.status(400).json({
        success: false,
        message: "From date cannot be after To date.",
      });
    }

    // Convert selected dates into IST boundaries
    const [year, month, day] = to.split("-").map(Number);
    const nextDate = new Date(Date.UTC(year, month - 1, day + 1))
      .toISOString()
      .slice(0, 10);

    const startDate = new Date(`${from}T00:00:00+05:30`);
    const endDate = new Date(`${nextDate}T00:00:00+05:30`);

    // Separate date filters for each collection
    const userDateFilter = {
      createdAt: { $gte: startDate, $lt: endDate },
    };

    const referralDateFilter = {
      registeredAt: { $gte: startDate, $lt: endDate },
    };

    const orderDateFilter = {
      purchaseDate: { $gte: startDate, $lt: endDate },
    };

    // Daily aggregation helper
    const getDailyCounts = async (Model, dateField, filter = {}) => {
      return Model.aggregate([
        {
          $match: {
            ...filter,
            [dateField]: {
              $gte: startDate,
              $lt: endDate,
            },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: `$${dateField}`,
                timezone: "Asia/Kolkata",
              },
            },
            count: { $sum: 1 },
          },
        },
      ]);
    };

    const [
      totalUsers,
      totalReferrals,
      activePlans,
      totalOrders,
      recentUsers,
      dailyUsers,
      dailyReferrals,
      dailyOrders,
    ] = await Promise.all([
      User.countDocuments({
        role: "user",
        ...userDateFilter,
      }),

      ReferralLog.countDocuments(referralDateFilter),

      Plan.countDocuments({ isActive: true }),

      PlanPurchase.countDocuments({
        status: "paid",
        ...orderDateFilter,
      }),

      User.find({
        role: "user",
        ...userDateFilter,
      })
        .select("fullName email role createdAt")
        .sort({ createdAt: -1, _id: -1 })
        .limit(5)
        .lean(),

      getDailyCounts(User, "createdAt", { role: "user" }),

      getDailyCounts(ReferralLog, "registeredAt"),

      getDailyCounts(PlanPurchase, "purchaseDate", {
        status: "paid",
      }),
    ]);

    // Convert aggregation results into lookup maps
    const usersMap = new Map(dailyUsers.map((item) => [item._id, item.count]));

    const referralsMap = new Map(
      dailyReferrals.map((item) => [item._id, item.count]),
    );

    const ordersMap = new Map(
      dailyOrders.map((item) => [item._id, item.count]),
    );

    // Generate every date, including dates with zero activity
    const dailyReport = [];
    const currentDate = new Date(`${from}T00:00:00Z`);
    const lastDate = new Date(`${to}T00:00:00Z`);

    while (currentDate <= lastDate) {
      const date = currentDate.toISOString().slice(0, 10);

      dailyReport.push({
        date,
        newUsers: usersMap.get(date) || 0,
        referrals: referralsMap.get(date) || 0,
        paidOrders: ordersMap.get(date) || 0,
      });

      currentDate.setUTCDate(currentDate.getUTCDate() + 1);
    }

    return res.status(200).json({
      success: true,

      stats: {
        totalUsers,
        totalReferrals,
        activePlans,
        totalOrders,
      },

      recentActivity: recentUsers.map((user) => ({
        id: user._id,
        name: user.fullName,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        type: "user_registered",
      })),

      dailyReport,
    });
  } catch (error) {
    console.error("Admin dashboard error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load dashboard data.",
    });
  }
};

module.exports = { getAdminDashboard };
