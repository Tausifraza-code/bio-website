const mongoose = require("mongoose");

const planPurchaseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    planId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Plan",
      required: true,
    },

    // Purchase ke waqt plan ki details ka snapshot
    planName: {
      type: String,
      required: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 1,
    },

    durationValue: {
      type: Number,
      required: true,
      min: 1,
    },

    durationUnit: {
      type: String,
      enum: ["days", "months", "years"],
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "paid", "failed", "cancelled", "refunded"],
      default: "pending",
      index: true,
    },

    razorpayOrderId: {
      type: String,
      default: undefined,
      unique: true,
      sparse: true,
    },

    razorpayPaymentId: {
      type: String,
      default: undefined,
      unique: true,
      sparse: true,
    },

    purchaseDate: {
      type: Date,
      default: null,
    },

    expiryDate: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("PlanPurchase", planPurchaseSchema);
