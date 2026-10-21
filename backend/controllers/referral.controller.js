const User = require("../models/user");
const ReferralLog = require("../models/ReferralLog");

// GET detailed referral report (Admin only)
const getReferralReport = async (req, res) => {
  try {
    // Pagination
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(
      100,
      Math.max(1, parseInt(req.query.limit, 10) || 10),
    );
    const skip = (page - 1) * limit;

    // Search and filters
    const search = (req.query.search || "").trim();
    const role = req.query.role;
    const minReferrals = req.query.minReferrals;

    if (role && !["user", "admin"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role. Use user or admin.",
      });
    }

    if (
      minReferrals !== undefined &&
      (!/^\d+$/.test(minReferrals) ||
        !Number.isSafeInteger(Number(minReferrals)))
    ) {
      return res.status(400).json({
        success: false,
        message: "minReferrals must be a non-negative integer.",
      });
    }

    const sortBy = req.query.sortBy || "date";
    const sortOrder = req.query.sortOrder || "desc";

    if (!["date", "referrals"].includes(sortBy)) {
      return res.status(400).json({
        success: false,
        message: "sortBy must be date or referrals.",
      });
    }

    if (!["asc", "desc"].includes(sortOrder)) {
      return res.status(400).json({
        success: false,
        message: "sortOrder must be asc or desc.",
      });
    }

    // Build search query
    const userQuery = {};

    if (search) {
      const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      userQuery.$or = [
        { fullName: { $regex: escapedSearch, $options: "i" } },
        { email: { $regex: escapedSearch, $options: "i" } },
      ];
    }

    if (role) {
      userQuery.role = role;
    }

    // Count referral logs per referrer
    const referralCounts = await ReferralLog.aggregate([
      {
        $group: {
          _id: "$referrerId",
          totalReferrals: { $sum: 1 },
        },
      },
    ]);

    const countMap = new Map(
      referralCounts.map((item) => [item._id.toString(), item.totalReferrals]),
    );

    // Fetch matching users
    const users = await User.find(userQuery)
      .select("fullName email role referralCode referredBy createdAt")
      .lean();

    // Add referral counts and apply minimum-referral filter
    let report = users.map((user) => ({
      userId: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      referralCode: user.referralCode,
      referredBy: user.referredBy,
      totalReferrals: countMap.get(user._id.toString()) || 0,
      referredUsers: [],
      registeredAt: user.createdAt,
    }));

    if (minReferrals !== undefined) {
      report = report.filter(
        (user) => user.totalReferrals >= Number(minReferrals),
      );
    }

    // Sort the matching report
    report.sort((a, b) => {
      let comparison;

      if (sortBy === "referrals") {
        comparison = a.totalReferrals - b.totalReferrals;
      } else {
        comparison =
          new Date(a.registeredAt).getTime() -
          new Date(b.registeredAt).getTime();
      }

      if (comparison === 0) {
        comparison = String(a.userId).localeCompare(String(b.userId));
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });

    const totalUsers = report.length;
    const totalPages = Math.ceil(totalUsers / limit);
    const paginatedReport = report.slice(skip, skip + limit);

    // Fetch referred-user details only for the displayed referrers
    const displayedReferrerIds = paginatedReport.map((user) => user.userId);

    const referralLogs = displayedReferrerIds.length
      ? await ReferralLog.find({
          referrerId: { $in: displayedReferrerIds },
        })
          .populate("referredUserId", "fullName email createdAt")
          .sort({ registeredAt: -1 })
          .lean()
      : [];

    const referredUsersMap = new Map();

    for (const log of referralLogs) {
      const referrerId = log.referrerId.toString();

      if (!referredUsersMap.has(referrerId)) {
        referredUsersMap.set(referrerId, []);
      }

      if (log.referredUserId) {
        referredUsersMap.get(referrerId).push({
          userId: log.referredUserId._id,
          fullName: log.referredUserId.fullName,
          email: log.referredUserId.email,
          referralCodeUsed: log.referralCodeUsed,
          registeredAt: log.registeredAt,
        });
      }
    }

    const data = paginatedReport.map((user) => ({
      ...user,
      referredUsers: referredUsersMap.get(user.userId.toString()) || [],
    }));

    // Global referral-signup count, independent of user filters
    const totalReferralSignups = await ReferralLog.countDocuments();

    return res.status(200).json({
      success: true,
      totalUsers,
      totalReferralSignups,
      pagination: {
        currentPage: page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1 && totalPages > 0,
      },
      filters: {
        search,
        role: role || null,
        minReferrals: minReferrals !== undefined ? Number(minReferrals) : null,
        sortBy,
        sortOrder,
      },
      data,
    });
  } catch (error) {
    console.error("Referral report error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch referral report",
    });
  }
};

module.exports = { getReferralReport };
