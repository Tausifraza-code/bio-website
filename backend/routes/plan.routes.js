const express = require("express");
const { protect } = require("../middleware/auth.middleware");
const { adminOnly } = require("../middleware/admin.middleware");

const {
  createPlan,
  getAllPlans,
  updatePlan,
  togglePlanStatus,
} = require("../controllers/plan.controller");

const router = express.Router();

// All routes require an authenticated admin
router.use(protect, adminOnly);

// Create a plan
router.post("/", createPlan);

// Get all plans (including disabled plans)
router.get("/", getAllPlans);

// Edit a plan
router.put("/:id", updatePlan);

// Enable or disable a plan
router.patch("/:id/status", togglePlanStatus);

module.exports = router;
