const express = require("express");
const { protect } = require("../middleware/auth.middleware");

const {
  saveProfile,
  getProfile,
  getPublicProfile,
  uploadProfileImage,
} = require("../controllers/profile.controller");

const { uploadWithField } = require("../middleware/upload.middleware");

const router = express.Router();

router.get("/", protect, getProfile);
router.put("/", protect, saveProfile);

router.post(
  "/upload-image",
  protect,
  uploadWithField("image"),
  uploadProfileImage,
);

router.get("/public/:subdomain", getPublicProfile);

module.exports = router;
