const MiniProfile = require("../models/MiniProfile");
const Product = require("../models/Product");
const Gallery = require("../models/Gallery");
const QRCode = require("../models/QRCode");
const User = require("../models/User");
const { uploadToImgBB } = require("../utils/imgbb");

const allowedFields = [
  "firstName",
  "lastName",
  "businessName",
  "industry",
  "subdomain",
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
  "avatar",
  "logo",
  "banner",
  "qrCode",
  "activeTheme",
  "activeLayout",
  "selectedPlan",
];

const saveProfile = async (req, res) => {
  try {
    const updates = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    const profile = await MiniProfile.findOneAndUpdate(
      { userId: req.user._id },
      { $set: updates, $setOnInsert: { userId: req.user._id } },
      {
        returnDocument: "after",
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      },
    );

    return res.status(200).json({
      success: true,
      message: "Mini website profile saved successfully",
      profile,
    });
  } catch (error) {
    console.error("Save profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to save profile",
    });
  }
};

const getProfile = async (req, res) => {
  try {
    const profile = await MiniProfile.findOne({
      userId: req.user._id,
    });

    return res.status(200).json({
      success: true,
      profile,
    });
  } catch (error) {
    console.error("Get profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch profile",
    });
  }
};

const uploadProfileImage = async (req, res) => {
  try {
    const { field, socialCardId } = req.body;

    const allowedImageFields = [
      "avatar",
      "logo",
      "banner",
      "qrCode",
      "socialCard",
    ];

    if (!allowedImageFields.includes(field)) {
      return res.status(400).json({
        success: false,
        message: "Invalid image field",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image file is required",
      });
    }

    // Social card upload ke liye card ID required hai.
    if (field === "socialCard" && !socialCardId) {
      return res.status(400).json({
        success: false,
        message: "Social card ID is required",
      });
    }

    const profile = await MiniProfile.findOne({
      userId: req.user._id,
    });

    if (field === "socialCard") {
      if (!profile) {
        return res.status(404).json({
          success: false,
          message: "Profile not found",
        });
      }

      const socialCard = profile.socialCards.id(socialCardId);

      if (!socialCard) {
        return res.status(404).json({
          success: false,
          message: "Social card not found",
        });
      }
    }

    // Existing ImgBB upload utility
    const uploadResult = await uploadToImgBB(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype,
    );

    if (!uploadResult?.url) {
      throw new Error("ImgBB did not return an image URL");
    }

    let updatedProfile;

    if (field === "socialCard") {
      const socialCard = profile.socialCards.id(socialCardId);
      socialCard.profileImage = uploadResult.url;

      await profile.save();
      updatedProfile = profile;
    } else {
      updatedProfile = await MiniProfile.findOneAndUpdate(
        { userId: req.user._id },
        {
          $set: { [field]: uploadResult.url },
        },
        {
          new: true,
          runValidators: true,
        },
      );
    }

    return res.status(200).json({
      success: true,
      message:
        field === "socialCard"
          ? "Social card image uploaded successfully"
          : "Profile image uploaded successfully",
      imageUrl: uploadResult.url,
      profile: updatedProfile,
    });
  } catch (error) {
    console.error("Upload Profile Image Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to upload image",
    });
  }
};

const getPublicProfile = async (req, res) => {
  try {
    const subdomain = req.params.subdomain?.trim().toLowerCase();

    if (!subdomain) {
      return res.status(400).json({
        success: false,
        message: "Subdomain is required",
      });
    }

    // 1. Get complete saved profile
    const profile = await MiniProfile.findOne({ subdomain }).lean();

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Public profile not found",
      });
    }

    // 2. Get this user's active products/services
    // 3. Get this user's gallery images
    const [products, gallery, assignedQR] = await Promise.all([
      Product.find({
        userId: profile.userId,
        status: "active",
      })
        .sort({ createdAt: -1 })
        .lean(),

      Gallery.find({
        userId: profile.userId,
      })
        .populate("productId", "name price type")
        .sort({ createdAt: -1 })
        .lean(),

      QRCode.findOne({
        assignedUserId: profile.userId,
        status: "assigned",
        qrPath: { $exists: true, $nin: [null, ""] },
      })
        .select("qrPath")
        .sort({ assignedAt: -1 })
        .lean(),
    ]);

    // Return everything together
    return res.status(200).json({
      success: true,
      profile,
      products,
      gallery,
      qrPath: assignedQR?.qrPath || null,
    });
  } catch (error) {
    console.error("Get public profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch public profile",
    });
  }
};

const uploadSocialCardImage = async (req, res) => {
  try {
    const { socialCardId } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please select an image",
      });
    }

    if (!socialCardId) {
      return res.status(400).json({
        success: false,
        message: "Social card ID is required",
      });
    }

    // Find logged-in user
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Find social card inside embedded miniProfile
    const socialCard = user.miniProfile?.socialCards?.id(socialCardId);

    if (!socialCard) {
      return res.status(404).json({
        success: false,
        message: "Social card not found",
      });
    }

    // Upload image to ImgBB
    const uploadResult = await uploadToImgBB(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype,
    );

    if (!uploadResult?.url) {
      return res.status(500).json({
        success: false,
        message: "ImgBB did not return an image URL",
      });
    }

    // Update only this social card's image
    socialCard.profileImage = uploadResult.url;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Social card image uploaded successfully",
      imageUrl: uploadResult.url,
      socialCard,
    });
  } catch (error) {
    console.error("Social Card Image Upload Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to upload social card image",
    });
  }
};

module.exports = {
  saveProfile,
  getProfile,
  getPublicProfile,
  uploadProfileImage,
  uploadSocialCardImage,
};
