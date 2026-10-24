const mongoose = require("mongoose");
const PaymentSettings = require("../models/PaymentSettings");
const { uploadToImgBB } = require("../utils/imgbb");

const isValidUpiId = (value) => /^[\w.-]+@[\w.-]+$/.test(value);

const handleError = (res, error) => {
  console.error("Payment settings error:", error);
  return res.status(500).json({
    success: false,
    message: "Unable to process payment settings.",
  });
};

// Owner: get own settings
const getMyPaymentSettings = async (req, res) => {
  try {
    const settings = await PaymentSettings.findOne({
      userId: req.user._id,
    });

    return res.status(200).json({
      success: true,
      data: settings,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

// Owner: create or update UPI settings without admin approval
const savePaymentSettings = async (req, res) => {
  try {
    const upiId = String(req.body.upiId || "").trim();

    if (!isValidUpiId(upiId)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid UPI ID.",
      });
    }

    let settings = await PaymentSettings.findOne({
      userId: req.user._id,
    });

    if (!settings) {
      settings = new PaymentSettings({
        userId: req.user._id,
      });
    }

    settings.upiId = upiId;
    settings.status = "approved";
    settings.rejectionReason = "";
    settings.reviewedBy = null;
    settings.reviewedAt = null;

    await settings.save();

    return res.status(200).json({
      success: true,
      message: "UPI settings saved successfully.",
      data: settings,
    });
  } catch (error) {
    console.error("Payment settings error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to save UPI settings.",
    });
  }
};

// Admin: view all submitted payment settings
const getPaymentSettingsForAdmin = async (req, res) => {
  try {
    const settings = await PaymentSettings.find()
      .populate("userId", "fullName email phone")
      .sort({ updatedAt: -1 });

    return res.status(200).json({
      success: true,
      count: settings.length,
      data: settings,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

// Admin: approve or reject a submission
const reviewPaymentSettings = async (req, res) => {
  try {
    const { status, rejectionReason = "" } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be approved or rejected.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment settings ID.",
      });
    }

    if (status === "rejected" && !String(rejectionReason).trim()) {
      return res.status(400).json({
        success: false,
        message: "A rejection reason is required.",
      });
    }

    const settings = await PaymentSettings.findById(req.params.id);

    if (!settings) {
      return res.status(404).json({
        success: false,
        message: "Payment settings not found.",
      });
    }

    settings.status = status;
    settings.rejectionReason =
      status === "rejected" ? String(rejectionReason).trim().slice(0, 500) : "";
    settings.reviewedBy = req.user._id;
    settings.reviewedAt = new Date();

    await settings.save();

    return res.status(200).json({
      success: true,
      message: `Payment settings ${status}.`,
      data: settings,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

// Public: return settings only after approval
// Public: return saved UPI settings without admin approval
const getApprovedPaymentSettings = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid business ID.",
      });
    }

    const settings = await PaymentSettings.findOne({
      userId: req.params.userId,
    }).select("userId upiId");

    if (!settings) {
      return res.status(404).json({
        success: false,
        message: "UPI settings are not configured.",
      });
    }

    return res.status(200).json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.error("Public payment settings error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load UPI settings.",
    });
  }
};

module.exports = {
  getMyPaymentSettings,
  savePaymentSettings,
  getPaymentSettingsForAdmin,
  reviewPaymentSettings,
  getApprovedPaymentSettings,
};
