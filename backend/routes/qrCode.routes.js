const express = require("express");
const { protect } = require("../middleware/auth.middleware");

const {
  activateQRCodeByCode,
  bindQRCodeToProfile,
  getMyBoundQRCode,
} = require("../controllers/qrCode.controller");

const router = express.Router();

router.get("/my", protect, getMyBoundQRCode);
router.post("/bind", protect, bindQRCodeToProfile);
router.post("/activate", protect, activateQRCodeByCode);

module.exports = router;
