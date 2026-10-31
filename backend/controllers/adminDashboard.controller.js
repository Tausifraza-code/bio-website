const User = require("../models/User");
const ReferralLog = require("../models/ReferralLog");
const Plan = require("../models/Plan");
const PlanPurchase = require("../models/PlanPurchase");

// GET /api/admin/dashboard
const getAdminDashboard = async (req, res) => {
  try {
    const [totalUsers, totalReferrals, activePlans, totalOrders, recentUsers] =
      await Promise.all([
        // Total registered users
        User.countDocuments({ role: "user" }),

        // Total referral signups
        ReferralLog.countDocuments(),

        // Active plans available on website
        Plan.countDocuments({ isActive: true }),

        // Successfully paid orders
        PlanPurchase.countDocuments({ status: "paid" }),

        // Latest 5 registered users
        User.find({ role: "user" })
          .select("fullName email role createdAt")
          .sort({ createdAt: -1, _id: -1 })
          .limit(5)
          .lean(),
      ]);

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
