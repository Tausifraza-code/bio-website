const mongoose = require("mongoose");

const gallerySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      default: null,
    },

    imageUrl: {
      type: String,
      required: true,
      trim: true,
    },

    thumbnailUrl: {
      type: String,
      default: "",
      trim: true,
    },

    deleteUrl: {
      type: String,
      default: "",
      trim: true,
    },

    title: {
      type: String,
      trim: true,
      default: "",
      maxlength: 150,
    },
  },
  {
    timestamps: true,
  },
);

gallerySchema.index({ userId: 1, createdAt: -1 });
gallerySchema.index({ userId: 1, productId: 1 });

const Gallery = mongoose.model("Gallery", gallerySchema);

module.exports = Gallery;
