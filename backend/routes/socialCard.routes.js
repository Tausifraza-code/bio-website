const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/auth.middleware");
const { uploadWithField } = require("../middleware/upload.middleware");

const {
  uploadSocialCardImage,
} = require("../controllers/socialCard.controller");

router.post(
  "/upload-image",
  protect,
  uploadWithField("image"),
  uploadSocialCardImage,
);

module.exports = router;
