const mongoose = require("mongoose");
const crypto = require("crypto");

const qrCodeSchema = new mongoose.Schema(
  {
    // Unique ID for the individual physical QR
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
      default: "",
      trim: true,
    },

    // Individual physical QR format
    format: {
      type: String,
      enum: ["standee", "pocket", "keychain"],
      default: undefined,
    },

    // Legacy QR sets can continue using this array
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

    // User's physical QR slot: 1, 2 or 3
    assignedSlot: {
      type: Number,
      enum: [1, 2, 3],
      default: null,
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

    generatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

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
  },
  { timestamps: true },
);

// One user can have only one QR in each assigned slot.
// Legacy records without assignedSlot are excluded.
qrCodeSchema.index(
  { assignedUserId: 1, assignedSlot: 1 },
  {
    unique: true,
    partialFilterExpression: {
      assignedSlot: { $in: [1, 2, 3] },
    },
    name: "unique_user_physical_qr_slot",
  },
);

// Generate unpredictable public QR paths
qrCodeSchema.statics.generateQRPath = function () {
  return `/q/${crypto.randomBytes(16).toString("hex")}`;
};

module.exports = mongoose.model("QRCode", qrCodeSchema);
