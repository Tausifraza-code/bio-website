const mongoose = require("mongoose");

// Schema for multiple product/service images
const productImageSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: [true, "Image URL is required"],
      trim: true,
      maxlength: 2048,
    },

    thumbnailUrl: {
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

    alt: {
      type: String,
      trim: true,
      default: "",
      maxlength: 200,
    },
  },
  { _id: true },
);

// Main Product & Service Schema
const productSchema = new mongoose.Schema(
  {
    // Owner of the product/service
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Product owner is required"],
      index: true,
    },

    // Product or service name
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxlength: 150,
    },

    // Product/service description
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: 5000,
    },

    // Price in the currency configured by the business
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },

    // Optional category
    category: {
      type: String,
      trim: true,
      default: "General",
      maxlength: 100,
    },

    // Distinguish products from services
    type: {
      type: String,
      enum: ["product", "service"],
      default: "product",
      required: true,
    },

    // ImgBB-hosted image details
    images: {
      type: [productImageSchema],
      default: [],
      validate: {
        validator: function (images) {
          return images.length <= 8;
        },
        message: "Maximum 8 images are allowed per product/service",
      },
    },

    // Visibility on the public Mini Website
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

// Dashboard listing and public product queries
productSchema.index({ userId: 1, createdAt: -1 });
productSchema.index({ userId: 1, status: 1, createdAt: -1 });

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
