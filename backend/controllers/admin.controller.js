const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { uploadToImgBB } = require("../utils/imgbb");

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const admin = await User.findOne({
      email: email.toLowerCase().trim(),
      role: "admin",
    }).select("+password");

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid admin credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid admin credentials",
      });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is missing in .env");
    }

    const token = jwt.sign(
      {
        userId: admin._id.toString(),
        role: admin.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    return res.status(200).json({
      success: true,
      message: "Admin login successful",
      token,
      admin: {
        id: admin._id,
        fullName: admin.fullName,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("Admin login error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// =====================================
// ADMIN: CHANGE PASSWORD
// =====================================

const changeAdminPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All password fields are required",
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 8 characters",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "New password and confirm password do not match",
      });
    }

    const admin = await User.findOne({
      _id: req.user._id,
      role: "admin",
    }).select("+password");

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin account not found",
      });
    }

    const isMatch = await bcrypt.compare(currentPassword, admin.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    admin.password = await bcrypt.hash(newPassword, 12);

    await admin.save();

    return res.status(200).json({
      success: true,
      message: "Admin password changed successfully",
    });
  } catch (error) {
    console.error("Change admin password error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// =====================================
// ADMIN: GET GENERAL SETTINGS
// =====================================

const getAdminGeneralSettings = async (req, res) => {
  try {
    const admin = await User.findOne({
      _id: req.user._id,
      role: "admin",
    }).select("adminSettings");

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin account not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "General settings fetched successfully",
      settings: admin.adminSettings,
    });
  } catch (error) {
    console.error("Get admin general settings error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// =====================================
// ADMIN: UPDATE GENERAL SETTINGS
// =====================================

const updateAdminGeneralSettings = async (req, res) => {
  try {
    const {
      websiteName,
      websiteLogo,
      websiteUrl,
      supportEmail,
      supportPhone,
      defaultTimezone,
    } = req.body;

    const allowedSettings = {
      websiteName,
      websiteLogo,
      websiteUrl,
      supportEmail,
      supportPhone,
      defaultTimezone,
    };

    const updates = {};

    Object.entries(allowedSettings).forEach(([key, value]) => {
      if (value !== undefined) {
        updates[`adminSettings.${key}`] =
          typeof value === "string" ? value.trim() : value;
      }
    });

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide at least one setting to update",
      });
    }

    const admin = await User.findOneAndUpdate(
      {
        _id: req.user._id,
        role: "admin",
      },
      {
        $set: updates,
      },
      {
        new: true,
        runValidators: true,
      },
    ).select("adminSettings");

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin account not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "General settings updated successfully",
      settings: admin.adminSettings,
    });
  } catch (error) {
    console.error("Update admin general settings error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const uploadAdminWebsiteLogo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Website logo image is required",
      });
    }

    // Only allow image files
    if (!req.file.mimetype.startsWith("image/")) {
      return res.status(400).json({
        success: false,
        message: "Please upload a valid image file",
      });
    }

    // Upload image to ImgBB
    const uploadResult = await uploadToImgBB(
      req.file.buffer,
      req.file.originalname,
    );

    if (!uploadResult?.url) {
      throw new Error("ImgBB did not return an image URL");
    }

    // Save uploaded logo URL in admin settings
    const admin = await User.findOneAndUpdate(
      {
        _id: req.user._id,
        role: "admin",
      },
      {
        $set: {
          "adminSettings.websiteLogo": uploadResult.url,
        },
      },
      {
        new: true,
        runValidators: true,
      },
    ).select("adminSettings");

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Website logo uploaded successfully",
      imageUrl: uploadResult.url,
      settings: admin.adminSettings,
    });
  } catch (error) {
    console.error("Upload Admin Website Logo Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to upload website logo",
    });
  }
};

const getPublicBranding = async (req, res) => {
  try {
    // Find admin whose website logo is uploaded
    const admin = await User.findOne({
      role: "admin",
      "adminSettings.websiteLogo": {
        $exists: true,
        $nin: ["", null],
      },
    })
      .select("adminSettings")
      .sort({ updatedAt: -1 })
      .lean();

    const settings = admin?.adminSettings || {};

    return res.status(200).json({
      success: true,
      settings: {
        websiteName: settings.websiteName || "BIO Website",
        websiteLogo: settings.websiteLogo || "",
        websiteUrl: settings.websiteUrl || "",
      },
    });
  } catch (error) {
    console.error("Get Public Branding Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch website branding",
    });
  }
};
module.exports = {
  adminLogin,
  changeAdminPassword,
  getAdminGeneralSettings,
  updateAdminGeneralSettings,
  uploadAdminWebsiteLogo,
  getPublicBranding,
};
