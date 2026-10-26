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

    activationCode: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      uppercase: true,
      index: true,
      match: /^BIO-[A-HJ-NP-Z2-9]{8}$/,
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

    downloadHistory: {
      type: [
        {
          format: {
            type: String,
            enum: ["standee", "pocket", "keychain"],
            required: true,
          },
          fileType: {
            type: String,
            enum: ["png", "jpg", "jpeg", "svg", "pdf"],
            required: true,
          },
          downloadedAt: {
            type: Date,
            default: Date.now,
          },
          downloadedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
          },
        },
      ],
      default: [],
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
