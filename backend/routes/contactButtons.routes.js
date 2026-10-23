const express = require("express");
const router = express.Router();

const {
  getContactButtons,
  saveContactButtons,
} = require("../controllers/contactButtons.controller");

const { protect } = require("../middleware/auth.middleware");

router.get("/", protect, getContactButtons);
router.put("/", protect, saveContactButtons);

module.exports = router;
