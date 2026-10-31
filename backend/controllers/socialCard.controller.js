const MiniProfile = require("../models/MiniProfile");
const { uploadToImgBB } = require("../utils/imgbb");

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

    // Find profile belonging to logged-in user
    const profile = await MiniProfile.findOne({
      userId: req.user._id,
    });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Mini profile not found",
      });
    }

    // Find the requested social card
    const socialCard = profile.socialCards.id(socialCardId);

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

    // Update only the targeted social card's profileImage in MongoDB
    await MiniProfile.updateOne(
      { userId: req.user._id, "socialCards._id": socialCard._id },
      { $set: { "socialCards.$.profileImage": uploadResult.url } },
    );

    socialCard.profileImage = uploadResult.url;

    return res.status(200).json({
      success: true,
      message: "Social card image uploaded successfully",
      imageUrl: uploadResult.url,
      socialCardId: String(socialCard._id),
      data: {
        socialCardId: String(socialCard._id),
        profileImage: uploadResult.url,
      },
    });
  } catch (error) {
    console.error("Social Card Image Upload Error:", error);

    const isTimeout =
      error.name === "TimeoutError" ||
      error.name === "AbortError" ||
      error.message?.includes("timeout") ||
      error.message?.includes("aborted");

    const message = isTimeout
      ? "ImgBB upload timed out. The ImgBB service (https://api.imgbb.com/1/upload) took too long to respond. Please try again."
      : error.message || "Failed to upload social card image";

    return res.status(500).json({
      success: false,
      message,
    });
  }
};

module.exports = {
  uploadSocialCardImage,
};
