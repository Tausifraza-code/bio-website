const express = require("express");
const { protect } = require("../middleware/auth.middleware");
const { adminOnly } = require("../middleware/admin.middleware");
const {
  generateQRBatch,
  getQRInventory,
} = require("../controllers/adminQR.controller");

const router = express.Router();

router.post("/generate", protect, adminOnly, generateQRBatch);
router.get("/inventory", protect, adminOnly, getQRInventory);

module.exports = router;
