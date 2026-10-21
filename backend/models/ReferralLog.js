const mongoose = require("mongoose");

const referralLogSchema = new mongoose.Schema(
  {
    referrerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    referredUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    referralCodeUsed: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },

    registeredAt: {
      type: Date,
      default: Date.now,
    },

    status: {
      type: String,
      enum: ["registered", "active"],
      default: "registered",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("ReferralLog", referralLogSchema);
