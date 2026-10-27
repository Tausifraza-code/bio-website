const express = require("express");
const { protect } = require("../middleware/auth.middleware");
const { getMyReferrals } = require("../controllers/referral.controller");

const router = express.Router();

router.get("/me", protect, getMyReferrals);

module.exports = router;
