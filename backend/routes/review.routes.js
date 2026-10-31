const express = require("express");
const router = express.Router();

const {
  createReview,
  getPublicReviews,
  deleteReview,
} = require("../controllers/review.controller");

const { protect } = require("../middleware/auth.middleware");

// Public routes
router.post("/", createReview);
router.get("/:subdomain", getPublicReviews);

// Protected route
router.delete("/:reviewId", protect, deleteReview);

module.exports = router;
