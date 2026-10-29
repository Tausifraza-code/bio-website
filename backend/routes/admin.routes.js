const express = require("express");
const { protect } = require("../middleware/auth.middleware");
const { adminOnly } = require("../middleware/admin.middleware");

const {
  getReferralReport,
  getReferredUsers,
} = require("../controllers/referral.controller");
const { adminLogin } = require("../controllers/admin.controller");
const {
  getAdminUsers,
  verifyUserProfile,
  unverifyUserProfile,
  getAdminUserProfile,
  updateAdminUserProfile,
} = require("../controllers/adminUsers.controller");
const {
  getAdminDashboard,
} = require("../controllers/adminDashboard.controller");

const router = express.Router();

// Admin login
router.post("/login", adminLogin);

router.get("/adminpanel", protect, adminOnly, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to Admin Panel",
    admin: {
      id: req.user._id,
      fullName: req.user.fullName,
      role: req.user.role,
    },
  });
});

router.get("/referrals", protect, adminOnly, getReferralReport);
router.get("/referrals/:userId/users", protect, adminOnly, getReferredUsers);
router.get("/dashboard", protect, adminOnly, getAdminDashboard);
router.get("/users", protect, adminOnly, getAdminUsers);
router.patch("/users/:userId/verify", protect, adminOnly, verifyUserProfile);

router.patch(
  "/users/:userId/unverify",
  protect,
  adminOnly,
  unverifyUserProfile,
);

router.get("/users/:userId/profile", protect, adminOnly, getAdminUserProfile);

router.put(
  "/users/:userId/profile",
  protect,
  adminOnly,
  updateAdminUserProfile,
);
module.exports = router;
