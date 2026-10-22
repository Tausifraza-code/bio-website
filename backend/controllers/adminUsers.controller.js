const User = require("../models/user");
const mongoose = require("mongoose");
const MiniProfile = require("../models/MiniProfile");
// GET /api/admin/users
const getAdminUsers = async (req, res) => {
  try {
    const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
    const limit = Math.min(
      100,
      Math.max(1, Number.parseInt(req.query.limit, 10) || 10),
    );
    const search = req.query.search?.trim() || "";

    const filter = { role: "user" };

    if (search) {
      const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

      filter.$or = [
        { fullName: { $regex: escapedSearch, $options: "i" } },
        { email: { $regex: escapedSearch, $options: "i" } },
        { phone: { $regex: escapedSearch, $options: "i" } },
      ];
    }

    const [users, totalUsers] = await Promise.all([
      User.find(filter)
        .select("fullName email phone referralCode referredBy createdAt")
        .populate("referredBy", "fullName email")
        .sort({ createdAt: -1, _id: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),

      User.countDocuments(filter),
    ]);

    const userIds = users.map((user) => user._id);

    const profiles = await MiniProfile.find({
      userId: { $in: userIds },
    })
      .select("userId isVerified verifiedAt businessName subdomain")
      .lean();

    const profileMap = new Map(
      profiles.map((profile) => [profile.userId.toString(), profile]),
    );

    const usersWithProfile = users.map((user) => {
      const profile = profileMap.get(user._id.toString());

      return {
        ...user,
        profile: {
          isVerified: profile?.isVerified ?? false,
          verifiedAt: profile?.verifiedAt ?? null,
          businessName: profile?.businessName ?? "",
          subdomain: profile?.subdomain ?? "",
        },
      };
    });

    return res.status(200).json({
      success: true,
      users: usersWithProfile,
      pagination: {
        currentPage: page,
        limit,
        totalUsers,
        totalPages: Math.ceil(totalUsers / limit),
      },
    });
  } catch (error) {
    console.error("Admin users error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load users.",
    });
  }
};

const verifyUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    const user = await User.findOne({
      _id: userId,
      role: "user",
    }).select("_id");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const profile = await MiniProfile.findOneAndUpdate(
      { userId: user._id },
      {
        $set: {
          isVerified: true,
          verifiedAt: new Date(),
        },
        $setOnInsert: {
          userId: user._id,
        },
      },
      {
        upsert: true,
        returnDocument: "after",
        runValidators: true,
        setDefaultsOnInsert: true,
      },
    );

    return res.status(200).json({
      success: true,
      message: "User profile verified successfully",
      profile,
    });
  } catch (error) {
    console.error("Verify user profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to verify user profile",
    });
  }
};

const unverifyUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    const user = await User.findOne({
      _id: userId,
      role: "user",
    }).select("_id");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const profile = await MiniProfile.findOneAndUpdate(
      { userId: user._id },
      {
        $set: {
          isVerified: false,
          verifiedAt: null,
        },
      },
      {
        returnDocument: "after",
        runValidators: true,
      },
    );

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "User profile not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User verification removed successfully",
      profile,
    });
  } catch (error) {
    console.error("Unverify user profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to remove user verification",
    });
  }
};

module.exports = { getAdminUsers, verifyUserProfile, unverifyUserProfile };
