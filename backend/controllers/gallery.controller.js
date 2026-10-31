const mongoose = require("mongoose");
const multer = require("multer");
const sharp = require("sharp");
const User = require("../models/User");

const Gallery = require("../models/Gallery");
const Product = require("../models/Product");
const { uploadToImgBB } = require("../utils/imgbb");

// Multer: image ko memory mein receive karo
const imageUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 10,
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

// Routes mein controller ka middleware connect hoga
const parseGalleryImage = (req, res, next) => {
  imageUpload.single("image")(req, res, (error) => {
    if (error instanceof multer.MulterError) {
      const message =
        error.code === "LIMIT_FILE_SIZE"
          ? "File is too large. Maximum size is 5MB."
          : error.message;

      return res.status(400).json({
        success: false,
        message,
      });
    }

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    next();
  });
};

const parseGalleryImages = (req, res, next) => {
  imageUpload.array("images", 10)(req, res, (error) => {
    if (error instanceof multer.MulterError) {
      if (error.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          success: false,
          message: "Each image must be 5MB or smaller.",
        });
      }

      if (error.code === "LIMIT_FILE_COUNT") {
        return res.status(400).json({
          success: false,
          message: "You can upload a maximum of 10 images at once.",
        });
      }

      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    next();
  });
};

const parseProfileImages = (req, res, next) => {
  imageUpload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "avatar", maxCount: 1 },
    { name: "logo", maxCount: 1 },
    { name: "banner", maxCount: 1 },
  ])(req, res, (error) => {
    if (error) {
      return res.status(400).json({
        success: false,
        message:
          error.code === "LIMIT_FILE_SIZE"
            ? "Each image must be 5MB or smaller."
            : error.message || "Image upload failed.",
      });
    }

    next();
  });
};

// Image compress karke WebP mein convert karo
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

  return image
    .rotate()
    .resize({
      width: 1600,
      height: 1600,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({
      quality: 78,
      effort: 4,
    })
    .toBuffer();
};

// Linked product ko verify karo
const validateProductOwnership = async (productId, userId) => {
  if (!productId || productId === "null") {
    return null;
  }

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    const error = new Error("Invalid product ID.");
    error.statusCode = 400;
    throw error;
  }

  const product = await Product.findOne({
    _id: productId,
    userId,
  });

  if (!product) {
    const error = new Error("Product not found or you do not have permission.");
    error.statusCode = 404;
    throw error;
  }

  return product;
};

// Upload image to ImgBB
const uploadToGallery = async (file) => {
  const compressedBuffer = await compressImage(file);

  const uploaded = await uploadToImgBB(
    compressedBuffer,
    `${Date.now()}-gallery.webp`,
  );

  if (!uploaded.url) {
    const error = new Error("Image hosting did not return a valid URL.");
    error.statusCode = 502;
    throw error;
  }

  return {
    imageUrl: uploaded.url,
    thumbnailUrl: uploaded.thumb || uploaded.displayUrl || uploaded.url,
    deleteUrl: uploaded.deleteUrl || "",
  };
};

// CREATE / UPLOAD GALLERY IMAGE
const uploadGalleryImage = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please select at least one image using the 'images' field.",
      });
    }

    const title =
      typeof req.body.title === "string" ? req.body.title.trim() : "";

    if (title.length > 150) {
      return res.status(400).json({
        success: false,
        message: "Title cannot exceed 150 characters.",
      });
    }

    const product = await validateProductOwnership(
      req.body.productId,
      req.user._id,
    );

    // Har image ko compress karke ImgBB par upload karo.
    const uploadedImages = await Promise.all(
      req.files.map((file) => uploadToGallery(file)),
    );

    // Har image ke liye alag Gallery record banao.
    const galleryRecords = uploadedImages.map((imageData) => ({
      userId: req.user._id,
      productId: product ? product._id : null,
      ...imageData,
      title,
    }));

    const savedImages = await Gallery.insertMany(galleryRecords);

    return res.status(201).json({
      success: true,
      message: "Gallery images uploaded successfully.",
      count: savedImages.length,
      data: savedImages,
    });
  } catch (error) {
    console.error("Gallery upload error:", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message:
        error.statusCode && error.statusCode < 500
          ? error.message
          : "Failed to upload gallery images.",
    });
  }
};

// GET LOGGED-IN USER'S GALLERY
const getMyGallery = async (req, res) => {
  try {
    const gallery = await Gallery.find({
      userId: req.user._id,
    })
      .populate("productId", "name price type")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: gallery.length,
      data: gallery,
    });
  } catch (error) {
    console.error("Get my gallery error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch gallery.",
    });
  }
};

// GET PUBLIC GALLERY FOR A PROFILE
// Public profile URL must use a stable user identifier.
const getPublicGallery = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid profile ID.",
      });
    }

    const gallery = await Gallery.find({
      userId: req.params.userId,
    })
      .populate("productId", "name price type")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: gallery.length,
      data: gallery,
    });
  } catch (error) {
    console.error("Get public gallery error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch public gallery.",
    });
  }
};

// UPDATE GALLERY IMAGE / TITLE / PRODUCT LINK
const updateGalleryImage = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid gallery image ID.",
      });
    }

    const galleryImage = await Gallery.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!galleryImage) {
      return res.status(404).json({
        success: false,
        message: "Gallery image not found.",
      });
    }

    const updates = {};

    if (req.body.title !== undefined) {
      if (
        typeof req.body.title !== "string" ||
        req.body.title.trim().length > 150
      ) {
        return res.status(400).json({
          success: false,
          message: "Title must be a string of at most 150 characters.",
        });
      }

      updates.title = req.body.title.trim();
    }

    if (req.body.productId !== undefined) {
      const product = await validateProductOwnership(
        req.body.productId,
        req.user._id,
      );

      updates.productId = product ? product._id : null;
    }

    if (req.file) {
      const imageData = await uploadToGallery(req.file);
      Object.assign(updates, imageData);
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Provide a title, product link, or new image to update.",
      });
    }

    Object.assign(galleryImage, updates);
    await galleryImage.save();

    return res.status(200).json({
      success: true,
      message: "Gallery image updated successfully.",
      data: galleryImage,
    });
  } catch (error) {
    console.error("Update gallery image error:", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message:
        error.statusCode || error.message === "Unsupported image format."
          ? error.message
          : "Failed to update gallery image.",
    });
  }
};

// DELETE GALLERY IMAGE
const deleteGalleryImage = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid gallery image ID.",
      });
    }

    const galleryImage = await Gallery.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!galleryImage) {
      return res.status(404).json({
        success: false,
        message: "Gallery image not found.",
      });
    }

    // Delete database record. External ImgBB deletion is not
    // performed here because deleteUrl is not a deletion API contract.
    await Gallery.deleteOne({
      _id: galleryImage._id,
      userId: req.user._id,
    });

    return res.status(200).json({
      success: true,
      message: "Gallery image record deleted successfully.",
    });
  } catch (error) {
    console.error("Delete gallery image error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete gallery image.",
    });
  }
};

// Verify target user for admin gallery operations
const getAdminTargetUser = async (userId) => {
  if (!mongoose.isValidObjectId(userId)) {
    const error = new Error("Invalid user ID.");
    error.statusCode = 400;
    throw error;
  }

  const user = await User.findOne({ _id: userId, role: "user" }).select("_id");

  if (!user) {
    const error = new Error("User not found.");
    error.statusCode = 404;
    throw error;
  }

  return user;
};

// GET selected user's gallery
const getAdminUserGallery = async (req, res) => {
  try {
    const user = await getAdminTargetUser(req.params.userId);

    const gallery = await Gallery.find({ userId: user._id })
      .populate("productId", "name price type")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: gallery.length,
      data: gallery,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.statusCode
        ? error.message
        : "Failed to fetch user gallery.",
    });
  }
};

// UPLOAD images to selected user's gallery
const uploadAdminUserGallery = async (req, res) => {
  try {
    const user = await getAdminTargetUser(req.params.userId);

    if (!req.files?.length) {
      return res.status(400).json({
        success: false,
        message: "Please select at least one image.",
      });
    }

    const title =
      typeof req.body.title === "string" ? req.body.title.trim() : "";

    if (title.length > 150) {
      return res.status(400).json({
        success: false,
        message: "Title cannot exceed 150 characters.",
      });
    }

    const product = await validateProductOwnership(
      req.body.productId,
      user._id,
    );

    const uploadedImages = await Promise.all(
      req.files.map((file) => uploadToGallery(file)),
    );

    const records = uploadedImages.map((imageData) => ({
      userId: user._id,
      productId: product ? product._id : null,
      ...imageData,
      title,
    }));

    const savedImages = await Gallery.insertMany(records);

    return res.status(201).json({
      success: true,
      message: "Gallery images uploaded successfully.",
      count: savedImages.length,
      data: savedImages,
    });
  } catch (error) {
    console.error("Admin gallery upload error:", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.statusCode
        ? error.message
        : "Failed to upload gallery images.",
    });
  }
};

// UPDATE selected user's gallery image
const updateAdminUserGalleryImage = async (req, res) => {
  try {
    const user = await getAdminTargetUser(req.params.userId);

    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid gallery image ID.",
      });
    }

    const galleryImage = await Gallery.findOne({
      _id: req.params.id,
      userId: user._id,
    });

    if (!galleryImage) {
      return res.status(404).json({
        success: false,
        message: "Gallery image not found.",
      });
    }

    const updates = {};

    if (req.body.title !== undefined) {
      if (
        typeof req.body.title !== "string" ||
        req.body.title.trim().length > 150
      ) {
        return res.status(400).json({
          success: false,
          message: "Title must be at most 150 characters.",
        });
      }

      updates.title = req.body.title.trim();
    }

    if (req.body.productId !== undefined) {
      const product = await validateProductOwnership(
        req.body.productId,
        user._id,
      );

      updates.productId = product ? product._id : null;
    }

    if (req.file) {
      Object.assign(updates, await uploadToGallery(req.file));
    }

    if (!Object.keys(updates).length) {
      return res.status(400).json({
        success: false,
        message: "Provide a title, product link, or new image.",
      });
    }

    Object.assign(galleryImage, updates);
    await galleryImage.save();

    return res.status(200).json({
      success: true,
      message: "Gallery image updated successfully.",
      data: galleryImage,
    });
  } catch (error) {
    console.error("Admin gallery update error:", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.statusCode
        ? error.message
        : "Failed to update gallery image.",
    });
  }
};

// DELETE selected user's gallery image
const deleteAdminUserGalleryImage = async (req, res) => {
  try {
    const user = await getAdminTargetUser(req.params.userId);

    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid gallery image ID.",
      });
    }

    const deleted = await Gallery.findOneAndDelete({
      _id: req.params.id,
      userId: user._id,
    });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Gallery image not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Gallery image deleted successfully.",
    });
  } catch (error) {
    console.error("Admin gallery delete error:", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.statusCode
        ? error.message
        : "Failed to delete gallery image.",
    });
  }
};

module.exports = {
  parseGalleryImage,
  parseGalleryImages,
  parseProfileImages,
  uploadToGallery,
  uploadGalleryImage,
  getMyGallery,
  getPublicGallery,
  updateGalleryImage,
  deleteGalleryImage,

  getAdminUserGallery,
  uploadAdminUserGallery,
  updateAdminUserGalleryImage,
  deleteAdminUserGalleryImage,
};
