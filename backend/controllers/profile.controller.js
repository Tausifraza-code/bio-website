const MiniProfile = require("../models/MiniProfile");
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
    const { field } = req.body;

    const allowedImageFields = ["avatar", "logo", "banner", "qrCode"];

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

    // Upload image to ImgBB
    const uploadResult = await uploadToImgBB(
      req.file.buffer,
      req.file.originalname,
    );

    // Your existing imgbb.js returns url directly
    if (!uploadResult.url) {
      throw new Error("ImgBB did not return an image URL");
    }

    // Save uploaded image URL to the user's profile
    const profile = await MiniProfile.findOneAndUpdate(
      { userId: req.user._id },
      {
        $set: {
          [field]: uploadResult.url,
        },
        $setOnInsert: {
          userId: req.user._id,
        },
      },
      {
        returnDocument: "after",
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      },
    );

    return res.status(200).json({
      success: true,
      message: "Profile image uploaded successfully",
      imageUrl: uploadResult.url,
      profile,
    });
  } catch (error) {
    console.error("Upload Profile Image Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to upload profile image",
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

    const profile = await MiniProfile.findOne({
      subdomain,
    }).select(
      "firstName lastName businessName industry subdomain jobTitle headline bio phone whatsapp email website websiteUrl shopUnit area city state pincode landmark mapLink businessHours socialCards avatar logo banner qrCode activeTheme isVerified verifiedAt",
    );

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Public profile not found",
      });
    }

    return res.status(200).json({
      success: true,
      profile,
    });
  } catch (error) {
    console.error("Get public profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch public profile",
    });
  }
};

module.exports = {
  saveProfile,
  getProfile,
  getPublicProfile,
  uploadProfileImage,
};
