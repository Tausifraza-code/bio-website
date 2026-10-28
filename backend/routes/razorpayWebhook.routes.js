const express = require("express");
const {
  razorpayWebhook,
} = require("../controllers/razorpayWebhook.controller");

const router = express.Router();

router.post("/", razorpayWebhook);

module.exports = router;
