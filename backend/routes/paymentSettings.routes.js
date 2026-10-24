const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/auth.middleware");
const { adminOnly } = require("../middleware/admin.middleware");

const {
  getMyPaymentSettings,
  savePaymentSettings,
  getPaymentSettingsForAdmin,
  reviewPaymentSettings,
  getApprovedPaymentSettings,
} = require("../controllers/paymentSettings.controller");

router.get("/mine", protect, getMyPaymentSettings);

// UPI ID only — no QR upload
router.put("/mine", protect, savePaymentSettings);

// Legacy admin routes can remain temporarily
router.get("/admin", protect, adminOnly, getPaymentSettingsForAdmin);
router.patch("/admin/:id/review", protect, adminOnly, reviewPaymentSettings);

// Public saved UPI settings
router.get("/public/:userId", getApprovedPaymentSettings);

module.exports = router;
