const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/auth.middleware");

const {
  parseGalleryImage,
  parseGalleryImages,
  uploadGalleryImage,
  getMyGallery,
  getPublicGallery,
  updateGalleryImage,
  deleteGalleryImage,
} = require("../controllers/gallery.controller");

// Logged-in user's gallery
router.post("/", protect, parseGalleryImages, uploadGalleryImage);
router.get("/my-gallery", protect, getMyGallery);
router.put("/:id", protect, parseGalleryImage, updateGalleryImage);
router.delete("/:id", protect, deleteGalleryImage);

// Public profile gallery
router.get("/public/:userId", getPublicGallery);

module.exports = router;
