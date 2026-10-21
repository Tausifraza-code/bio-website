const User = require("../models/user");
const ReferralLog = require("../models/ReferralLog");

// GET /api/admin/dashboard
// Returns available statistics and recent user registrations.
const getAdminDashboard = async (req, res) => {
  try {
    const [totalUsers, totalReferralSignups, recentUsers] = await Promise.all([
      User.countDocuments(),
      ReferralLog.countDocuments(),
      User.find()
        .select("fullName email role createdAt")
        .sort({ createdAt: -1, _id: -1 })
        .limit(5)
        .lean(),
    ]);

    return res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalReferrals: totalReferralSignups,
        activePlans: null,
        totalOrders: null,
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
