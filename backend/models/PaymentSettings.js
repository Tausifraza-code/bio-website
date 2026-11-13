const mongoose = require("mongoose");

const paymentSettingsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

    upiId: {
      type: String,
      required: [true, "UPI ID is required"],
      trim: true,
      maxlength: 100,
    },

    qrImage: {
      url: {
        type: String,
        default: "",
        trim: true,
        maxlength: 2048,
      },
      deleteUrl: {
        type: String,
        default: "",
        trim: true,
        maxlength: 2048,
      },
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "approved",
      index: true,
    },

    rejectionReason: {
      type: String,
      default: "",
      trim: true,
      maxlength: 500,
    },

    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    reviewedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("PaymentSettings", paymentSettingsSchema);
