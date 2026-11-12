const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    miniProfileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MiniProfile",
      required: true,
      index: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    reviewerName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    reviewerEmail: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
      maxlength: 254,
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    comment: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },

    isApproved: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

reviewSchema.index({ miniProfileId: 1, createdAt: -1 });

module.exports = mongoose.model("Review", reviewSchema);
