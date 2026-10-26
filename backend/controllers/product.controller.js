const multer = require("multer");
const mongoose = require("mongoose");
const Product = require("../models/Product");
const { uploadToImgBB } = require("../utils/imgbb");
const sharp = require("sharp");
const { handleUploadError } = require("../middleware/upload.middleware");
const MiniProfile = require("../models/MiniProfile");

const handleProductError = (res, error, action) => {
  console.error(`${action} error:`, error);

  if (
    error instanceof mongoose.Error.ValidationError ||
    error instanceof mongoose.Error.CastError
  ) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }

  if (
    error.message === "Image buffer is required" ||
    error.message === "Unsupported image format."
  ) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }

  if (
    error.message === "ImgBB configuration is missing from .env" ||
    error.message === "ImgBB upload failed"
  ) {
    return res.status(502).json({
      success: false,
      message: "Image hosting failed. Please try again later.",
    });
  }

  return res.status(500).json({
    success: false,
    message: `Failed to ${action.toLowerCase()}. Please try again.`,
  });
};

const imageUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 50,
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/jpg",
      "image/webp",
      "image/gif",
    ];

    if (allowedTypes.includes(file.mimetype)) {
      return cb(null, true);
    }

    cb(new Error("Only JPEG, PNG, JPG, WEBP, and GIF images are allowed"));
  },
});

const parseProductImages = (req, res, next) => {
  imageUpload.array("images", 8)(req, res, (err) => {
    if (err) {
      return handleUploadError(err, req, res, next);
    }

    next();
  });
};

// Allowed fields and values are validated in the controller.
const validateProductInput = (body, isUpdate = false) => {
  const errors = [];

  if (!isUpdate || body.name !== undefined) {
    if (
      typeof body.name !== "string" ||
      !body.name.trim() ||
      body.name.trim().length > 150
    ) {
      errors.push("Product name is required (maximum 150 characters).");
    }
  }

  if (!isUpdate || body.description !== undefined) {
    if (
      typeof body.description !== "string" ||
      !body.description.trim() ||
      body.description.trim().length > 5000
    ) {
      errors.push("Description is required (maximum 5000 characters).");
    }
  }

  if (!isUpdate || body.price !== undefined) {
    const price = Number(body.price);

    if (
      body.price === "" ||
      body.price === undefined ||
      !Number.isFinite(price) ||
      price < 0
    ) {
      errors.push("Enter a valid non-negative price.");
    }
  }

  if (body.type !== undefined && !["product", "service"].includes(body.type)) {
    errors.push("Type must be product or service.");
  }

  if (
    body.status !== undefined &&
    !["active", "inactive"].includes(body.status)
  ) {
    errors.push("Status must be active or inactive.");
  }

  if (
    body.category !== undefined &&
    (typeof body.category !== "string" || body.category.trim().length > 100)
  ) {
    errors.push("Category must be a string of at most 100 characters.");
  }

  return errors;
};

// Compress an image before sending it to ImgBB.
const compressImage = async (file) => {
  const image = sharp(file.buffer, {
    limitInputPixels: 40000000,
  });

  const metadata = await image.metadata();

  if (
    !metadata.format ||
    !["jpeg", "png", "webp", "gif"].includes(metadata.format)
  ) {
    throw new Error("Unsupported image format.");
  }

  // Convert supported formats to optimized WebP.
  // Animated GIFs are not preserved as animations.
  return image
    .rotate()
    .resize({
      width: 1600,
      height: 1600,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: 78, effort: 4 })
    .toBuffer();
};

// Upload multiple images to ImgBB.
const uploadProductImages = async (files = []) => {
  if (files.length > 8) {
    throw new Error("Maximum 8 images are allowed.");
  }

  const uploadedImages = [];

  for (const file of files) {
    const compressedBuffer = await compressImage(file);

    const uploaded = await uploadToImgBB(
      compressedBuffer,
      `${Date.now()}-${file.originalname.replace(/\.[^.]+$/, "")}`,
    );

    if (!uploaded.url) {
      throw new Error("Image upload did not return a valid URL.");
    }

    uploadedImages.push({
      url: uploaded.url,
      thumbnailUrl: uploaded.thumb || uploaded.displayUrl || uploaded.url,
      deleteUrl: uploaded.deleteUrl || "",
      alt: file.originalname || "",
    });
  }

  return uploadedImages;
};

// CREATE product/service
const createProduct = async (req, res) => {
  try {
    const errors = validateProductInput(req.body);

    if (errors.length) {
      return res.status(400).json({
        success: false,
        message: errors[0],
        errors,
      });
    }

    const files = req.files || [];

    if (files.length > 8) {
      return res.status(400).json({
        success: false,
        message: "Maximum 8 images are allowed.",
      });
    }

    const images = await uploadProductImages(files);

    const product = await Product.create({
      userId: req.user._id,
      name: req.body.name.trim(),
      description: req.body.description.trim(),
      price: Number(req.body.price),
      category: req.body.category?.trim() || "General",
      type: req.body.type || "product",
      images,
      status: "active",
    });

    return res.status(201).json({
      success: true,
      message: "Product/service created successfully.",
      data: product,
    });
  } catch (error) {
    return handleProductError(res, error, "Create product");
  }
};

// GET products belonging to the logged-in user
const getMyProducts = async (req, res) => {
  try {
    const products = await Product.find({
      userId: req.user._id,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    return handleProductError(res, error, "Fetch products");
  }
};

// UPDATE a product owned by the logged-in user
const updateProduct = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID.",
      });
    }

    const errors = validateProductInput(req.body, true);

    if (errors.length) {
      return res.status(400).json({
        success: false,
        message: errors[0],
        errors,
      });
    }

    const product = await Product.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found or you do not have permission.",
      });
    }

    const updates = {};

    if (req.body.name !== undefined) {
      updates.name = req.body.name.trim();
    }

    if (req.body.description !== undefined) {
      updates.description = req.body.description.trim();
    }

    if (req.body.price !== undefined) {
      updates.price = Number(req.body.price);
    }

    if (req.body.category !== undefined) {
      updates.category = req.body.category.trim() || "General";
    }

    if (req.body.type !== undefined) {
      updates.type = req.body.type;
    }

    if (req.body.status !== undefined) {
      updates.status = req.body.status;
    }

    const newFiles = req.files || [];

    if (newFiles.length > 0) {
      if (product.images.length + newFiles.length > 8) {
        return res.status(400).json({
          success: false,
          message: "Maximum 8 images are allowed per product/service.",
        });
      }

      const uploadedImages = await uploadProductImages(newFiles);
      updates.images = [...product.images, ...uploadedImages];
    }

    const updatedProduct = await Product.findOneAndUpdate(
      {
        _id: product._id,
        userId: req.user._id,
      },
      { $set: updates },
      {
        returnDocument: "after",
        runValidators: true,
      },
    );

    return res.status(200).json({
      success: true,
      message: "Product/service updated successfully.",
      data: updatedProduct,
    });
  } catch (error) {
    return handleProductError(res, error, "Update product");
  }
};

// DELETE a product owned by the logged-in user
const deleteProduct = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID.",
      });
    }

    const product = await Product.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found or you do not have permission.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product/service deleted successfully.",
    });
  } catch (error) {
    return handleProductError(res, error, "Delete product");
  }
};

const getPublicProducts = async (req, res) => {
  try {
    const subdomain = req.params.subdomain?.trim().toLowerCase();

    const profile = await MiniProfile.findOne({ subdomain }).select("userId");

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Public profile not found.",
      });
    }

    const products = await Product.find({
      userId: profile.userId,
      status: "active",
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    console.error("Get public products error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch public products.",
    });
  }
};

module.exports = {
  createProduct,
  getMyProducts,
  updateProduct,
  deleteProduct,
  parseProductImages,
  getPublicProducts,
};
