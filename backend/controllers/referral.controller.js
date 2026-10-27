const mongoose = require("mongoose");
const User = require("../models/user");
const ReferralLog = require("../models/ReferralLog");

// GET /api/admin/referrals
// Paginated referral overview
const getReferralReport = async (req, res) => {
  try {
    const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
    const limit = Math.min(
      100,
      Math.max(1, Number.parseInt(req.query.limit, 10) || 10),
    );
    const skip = (page - 1) * limit;

    const search = (req.query.search || "").trim();
    const role = req.query.role;
    const minReferrals = req.query.minReferrals;
    const sortBy = req.query.sortBy || "date";
    const sortOrder = req.query.sortOrder || "desc";

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

    const userQuery = {};

    if (search) {
      const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

      userQuery.$or = [
        { fullName: { $regex: escapedSearch, $options: "i" } },
        { email: { $regex: escapedSearch, $options: "i" } },
        { referralCode: { $regex: escapedSearch, $options: "i" } },
      ];
    }

    if (role) {
      userQuery.role = role;
    } else {
      // Referral overview lists normal users by default.
      userQuery.role = "user";
    }

    const direction = sortOrder === "asc" ? 1 : -1;

    const pipeline = [
      { $match: userQuery },

      {
        $lookup: {
          from: ReferralLog.collection.name,
          let: { currentUserId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$referrerId", "$$currentUserId"] },
              },
            },
            { $count: "total" },
          ],
          as: "referralStats",
        },
      },

      {
        $addFields: {
          totalReferrals: {
            $ifNull: [{ $arrayElemAt: ["$referralStats.total", 0] }, 0],
          },
        },
      },

      ...(minReferrals !== undefined
        ? [
            {
              $match: {
                totalReferrals: { $gte: Number(minReferrals) },
              },
            },
          ]
        : []),

      {
        $sort:
          sortBy === "referrals"
            ? { totalReferrals: direction, _id: direction }
            : { createdAt: direction, _id: direction },
      },

      {
        $facet: {
          metadata: [{ $count: "total" }],
          data: [
            { $skip: skip },
            { $limit: limit },
            {
              $project: {
                _id: 0,
                userId: "$_id",
                fullName: 1,
                email: 1,
                role: 1,
                referralCode: 1,
                referredBy: 1,
                totalReferrals: 1,
                registeredAt: "$createdAt",
              },
            },
          ],
        },
      },
    ];

    const [result, totalReferralSignups] = await Promise.all([
      User.aggregate(pipeline),
      ReferralLog.countDocuments(),
    ]);

    const report = result[0] || { metadata: [], data: [] };
    const totalUsers = report.metadata[0]?.total || 0;
    const totalPages = Math.ceil(totalUsers / limit);

    return res.status(200).json({
      success: true,
      totalUsers,
      totalReferralSignups,
      pagination: {
        currentPage: page,
        limit,
        totalUsers,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1 && totalPages > 0,
      },
      filters: {
        search,
        role: role || "user",
        minReferrals: minReferrals !== undefined ? Number(minReferrals) : null,
        sortBy,
        sortOrder,
      },
      data: report.data,
    });
  } catch (error) {
    console.error("Referral report error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch referral report.",
    });
  }
};

// GET /api/admin/referrals/:userId/users
// Load referred users only when a referrer is selected.
const getReferredUsers = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid referrer ID.",
      });
    }

    const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
    const limit = Math.min(
      100,
      Math.max(1, Number.parseInt(req.query.limit, 10) || 10),
    );

    const referrer = await User.findOne({
      _id: userId,
      role: "user",
    })
      .select("_id fullName email referralCode")
      .lean();

    if (!referrer) {
      return res.status(404).json({
        success: false,
        message: "Referrer not found.",
      });
    }

    const filter = { referrerId: referrer._id };

    const [logs, totalUsers] = await Promise.all([
      ReferralLog.find(filter)
        .populate({
          path: "referredUserId",
          select: "fullName email phone createdAt",
        })
        .sort({ registeredAt: -1, _id: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),

      ReferralLog.countDocuments(filter),
    ]);

    const users = logs
      .filter((log) => log.referredUserId)
      .map((log) => ({
        userId: log.referredUserId._id,
        fullName: log.referredUserId.fullName,
        email: log.referredUserId.email,
        phone: log.referredUserId.phone,
        referralCodeUsed: log.referralCodeUsed,
        registeredAt: log.registeredAt,
      }));

    return res.status(200).json({
      success: true,
      referrer,
      users,
      pagination: {
        currentPage: page,
        limit,
        totalUsers,
        totalPages: Math.ceil(totalUsers / limit),
      },
    });
  } catch (error) {
    console.error("Referred users error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch referred users.",
    });
  }
};

const getMyReferrals = async (req, res) => {
  try {
    const userId = req.user._id;

    const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);

    const limit = Math.min(
      100,
      Math.max(1, Number.parseInt(req.query.limit, 10) || 10),
    );

    const user = await User.findById(userId)
      .select("fullName referralCode")
      .lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const filter = { referrerId: userId };

    const [totalReferrals, logs] = await Promise.all([
      ReferralLog.countDocuments(filter),

      ReferralLog.find(filter)
        .populate({
          path: "referredUserId",
          select: "fullName email createdAt",
        })
        .sort({ registeredAt: -1, _id: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
    ]);

    const referrals = logs
      .filter((log) => log.referredUserId)
      .map((log) => ({
        userId: log.referredUserId._id,
        fullName: log.referredUserId.fullName,
        email: log.referredUserId.email,
        registeredAt: log.registeredAt || log.referredUserId.createdAt,
      }));

    return res.status(200).json({
      success: true,
      data: {
        user: {
          fullName: user.fullName,
          referralCode: user.referralCode,
        },
        totalReferrals,
        referrals,
        pagination: {
          currentPage: page,
          limit,
          totalReferrals,
          totalPages: Math.ceil(totalReferrals / limit),
        },
      },
    });
  } catch (error) {
    console.error("My referrals error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch your referrals.",
    });
  }
};

module.exports = {
  getReferralReport,
  getReferredUsers,
  getMyReferrals,
};
