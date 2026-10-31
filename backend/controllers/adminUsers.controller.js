const User = require("../models/User");
const mongoose = require("mongoose");
const MiniProfile = require("../models/MiniProfile");
const { uploadToGallery } = require("./gallery.controller");
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

// GET /api/admin/users/:userId/profile
const getAdminUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID.",
      });
    }

    const user = await User.findOne({
      _id: userId,
      role: "user",
    })
      .select(
        "fullName email phone referralCode referredBy role createdAt updatedAt",
      )
      .populate("referredBy", "fullName email")
      .lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const profile = await MiniProfile.findOne({
      userId: user._id,
    }).lean();

    return res.status(200).json({
      success: true,
      user,
      profile: profile || null,
    });
  } catch (error) {
    console.error("getAdminUserProfile error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load user profile.",
    });
  }
};

// PUT /api/admin/users/:userId/profile
const updateAdminUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const { user: userInput = {}, profile: profileInput = {} } = req.body;

    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID.",
      });
    }

    if (
      !userInput ||
      typeof userInput !== "object" ||
      Array.isArray(userInput) ||
      !profileInput ||
      typeof profileInput !== "object" ||
      Array.isArray(profileInput)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid update data.",
      });
    }

    const existingUser = await User.findOne({
      _id: userId,
      role: "user",
    });

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Only permitted account fields can be edited.
    const allowedUserFields = ["fullName", "email", "phone"];
    const userUpdates = {};

    for (const field of allowedUserFields) {
      if (Object.prototype.hasOwnProperty.call(userInput, field)) {
        userUpdates[field] = userInput[field];
      }
    }

    if (userUpdates.fullName !== undefined) {
      if (
        typeof userUpdates.fullName !== "string" ||
        userUpdates.fullName.trim().length < 2 ||
        userUpdates.fullName.trim().length > 100
      ) {
        return res.status(400).json({
          success: false,
          message: "Full name must be between 2 and 100 characters.",
        });
      }

      userUpdates.fullName = userUpdates.fullName.trim();
    }

    if (userUpdates.email !== undefined) {
      if (
        typeof userUpdates.email !== "string" ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userUpdates.email.trim())
      ) {
        return res.status(400).json({
          success: false,
          message: "Please enter a valid email address.",
        });
      }

      userUpdates.email = userUpdates.email.trim().toLowerCase();
    }

    if (userUpdates.phone !== undefined) {
      if (typeof userUpdates.phone !== "string" || !userUpdates.phone.trim()) {
        return res.status(400).json({
          success: false,
          message: "Phone number cannot be empty.",
        });
      }

      userUpdates.phone = userUpdates.phone.trim();
    }

    // Never accept protected or server-managed profile fields here.
    const allowedProfileFields = [
      "firstName",
      "lastName",
      "businessName",
      "industry",
      "jobTitle",
      "headline",
      "bio",
      "phone",
      "whatsapp",
      "email",
      "website",
      "websiteUrl",
      "shopUnit",
      "area",
      "city",
      "state",
      "pincode",
      "landmark",
      "mapLink",
      "businessHours",
      "upiId",
      "socialCards",
      "contactButtons",
      "profileImage",
      "avatar",
      "logo",
      "banner",
      "activeTheme",
      "activeLayout",
    ];

    const profileUpdates = {};

    for (const field of allowedProfileFields) {
      if (Object.prototype.hasOwnProperty.call(profileInput, field)) {
        profileUpdates[field] = profileInput[field];
      }
    }

    // Keep public contact details in sync with account details unless the
    // profile form explicitly provides its own business contact values.
    if (userUpdates.email !== undefined && profileInput.email === undefined) {
      profileUpdates.email = userUpdates.email;
    }

    if (userUpdates.phone !== undefined && profileInput.phone === undefined) {
      profileUpdates.phone = userUpdates.phone;
    }

    // Update the profile first so invalid profile data cannot leave
    // account fields changed while the profile update fails.
    let updatedProfile = await MiniProfile.findOne({
      userId: existingUser._id,
    });

    if (Object.keys(profileUpdates).length > 0) {
      if (updatedProfile) {
        for (const [field, value] of Object.entries(profileUpdates)) {
          updatedProfile.set(field, value);
        }

        updatedProfile = await updatedProfile.save();
      } else {
        updatedProfile = await MiniProfile.create({
          userId: existingUser._id,
          ...profileUpdates,
        });
      }
    }

    let updatedUser = existingUser;

    if (Object.keys(userUpdates).length > 0) {
      updatedUser = await User.findOneAndUpdate(
        { _id: existingUser._id, role: "user" },
        { $set: userUpdates },
        { new: true, runValidators: true },
      );
    }

    // Return only public/non-secret account fields.
    const safeUser = await User.findById(updatedUser._id)
      .select(
        "fullName email phone referralCode referredBy role createdAt updatedAt",
      )
      .populate("referredBy", "fullName email")
      .lean();

    return res.status(200).json({
      success: true,
      message: "User profile updated successfully.",
      user: safeUser,
      profile: updatedProfile
        ? updatedProfile.toObject()
        : await MiniProfile.findOne({ userId: existingUser._id }).lean(),
    });
  } catch (error) {
    console.error("updateAdminUserProfile error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "That email or phone number is already in use.",
      });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Unable to update user profile.",
    });
  }
};

const uploadAdminUserProfileImages = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID.",
      });
    }

    const user = await User.findOne({
      _id: userId,
      role: "user",
    }).select("_id");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const allowedFields = ["profileImage", "avatar", "logo", "banner"];
    const files = req.files || {};
    const uploadedUrls = {};

    for (const field of allowedFields) {
      const file = files[field]?.[0];

      if (file) {
        const uploaded = await uploadToGallery(file);
        uploadedUrls[field] = uploaded.imageUrl;
      }
    }

    if (Object.keys(uploadedUrls).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please select at least one image.",
      });
    }

    const profile = await MiniProfile.findOneAndUpdate(
      { userId: user._id },
      {
        $set: uploadedUrls,
        $setOnInsert: { userId: user._id },
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      },
    );

    return res.status(200).json({
      success: true,
      message: "Profile images uploaded successfully.",
      profile: profile.toObject(),
    });
  } catch (error) {
    console.error("Admin profile image upload error:", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Unable to upload profile images.",
    });
  }
};

module.exports = {
  getAdminUsers,
  verifyUserProfile,
  unverifyUserProfile,
  getAdminUserProfile,
  updateAdminUserProfile,
  uploadAdminUserProfileImages,
};
