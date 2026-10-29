const express = require("express");
const { protect } = require("../middleware/auth.middleware");
const { adminOnly } = require("../middleware/admin.middleware");
const {
  createPlanOrder,
  verifyPlanPayment,
  getAllPlanPurchases,
  exportPlanPurchases,
} = require("../controllers/planPurchase.controller");

const router = express.Router();

router.post("/create-order", protect, createPlanOrder);
router.post("/verify-payment", protect, verifyPlanPayment);
router.get("/admin/history", protect, adminOnly, getAllPlanPurchases);
router.get("/admin/export", protect, adminOnly, exportPlanPurchases);

module.exports = router;
