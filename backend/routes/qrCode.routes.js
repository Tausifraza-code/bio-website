const express = require("express");
const { protect } = require("../middleware/auth.middleware");

const {
  bindQRCodeToProfile,
  getMyBoundQRCode,
} = require("../controllers/qrCode.controller");

const router = express.Router();

router.get("/my", protect, getMyBoundQRCode);
router.post("/bind", protect, bindQRCodeToProfile);

module.exports = router;
