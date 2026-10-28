const express = require("express");
const { getActivePlans } = require("../controllers/plan.controller");

const router = express.Router();

router.get("/active", getActivePlans);

module.exports = router;
