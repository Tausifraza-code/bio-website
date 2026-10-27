const express = require("express");
const router = express.Router();

const {
  createInquiry,
  getMyInquiries,
  deleteInquiry,
} = require("../controllers/inquiry.controller");

const { protect } = require("../middleware/auth.middleware");

// Public mini website contact form
router.post("/", createInquiry);

// Logged-in user dashboard
router.get("/me", protect, getMyInquiries);
router.delete("/:id", protect, deleteInquiry);

module.exports = router;
