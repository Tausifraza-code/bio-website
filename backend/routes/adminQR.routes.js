const express = require("express");
const { protect } = require("../middleware/auth.middleware");
const { adminOnly } = require("../middleware/admin.middleware");
const {
  generateQRBatch,
  getQRInventory,
  exportQRInventory,
  recordQRDownload,
} = require("../controllers/adminQR.controller");

const router = express.Router();

router.post("/generate", protect, adminOnly, generateQRBatch);
router.get("/inventory", protect, adminOnly, getQRInventory);
router.get("/export", protect, adminOnly, exportQRInventory);
router.post("/:id/downloads", protect, adminOnly, recordQRDownload);

module.exports = router;
