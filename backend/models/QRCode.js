const mongoose = require("mongoose");
const crypto = require("crypto");

const qrCodeSchema = new mongoose.Schema(
  {
    // Unique ID for the complete Standee + Pocket + Keychain set
    serialNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },

    // Unique path encoded in the physical QR
    qrPath: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    // Original QR URL, if available
    qrUrl: {
      type: String,
      default: null,
      trim: true,
    },

    // All three formats belong to the same QR set
    formats: {
      type: [String],
      enum: ["standee", "pocket", "keychain"],
      default: ["standee", "pocket", "keychain"],
    },

    assignedUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },

    // Admin/staff who generated the set
    generatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // Admin/staff who assigned the set
    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    businessName: {
      type: String,
      trim: true,
      default: null,
    },

    status: {
      type: String,
      enum: ["available", "assigned", "disabled"],
      default: "available",
      index: true,
    },

    generatedAt: {
      type: Date,
      default: Date.now,
    },

    assignedAt: {
      type: Date,
      default: null,
    },

    // Future use: immutable assignment history can be added here
  },
  { timestamps: true },
);

// Generate unpredictable public QR paths in the backend
qrCodeSchema.statics.generateQRPath = function () {
  return `/q/${crypto.randomBytes(16).toString("hex")}`;
};

module.exports = mongoose.model("QRCode", qrCodeSchema);
