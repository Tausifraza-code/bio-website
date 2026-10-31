const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/auth.middleware");
const { adminOnly } = require("../middleware/admin.middleware");
const { uploadWithField } = require("../middleware/upload.middleware");

// Controllers
const {
  adminLogin,
  changeAdminPassword,
  updateAdminGeneralSettings,
  getAdminGeneralSettings,
  uploadAdminWebsiteLogo,
  getPublicBranding,
} = require("../controllers/admin.controller");

const {
  getReferralReport,
  getReferredUsers,
} = require("../controllers/referral.controller");

const {
  getAdminUsers,
  verifyUserProfile,
  unverifyUserProfile,
  getAdminUserProfile,
  updateAdminUserProfile,
  uploadAdminUserProfileImages,
} = require("../controllers/adminUsers.controller");

const {
  getAdminDashboard,
} = require("../controllers/adminDashboard.controller");

// Gallery Controller
const {
  parseGalleryImage,
  parseGalleryImages,
  parseProfileImages,
  getAdminUserGallery,
  uploadAdminUserGallery,
  updateAdminUserGalleryImage,
  deleteAdminUserGalleryImage,
} = require("../controllers/gallery.controller");

// Product Controller
const {
  getAdminUserProducts,
  createAdminUserProduct,
  updateAdminUserProduct,
  deleteAdminUserProduct,
  parseProductImages,
} = require("../controllers/product.controller");

// ===============================
// ADMIN AUTH
// ===============================

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

// ===============================
// ADMIN DASHBOARD
// ===============================

router.get("/dashboard", protect, adminOnly, getAdminDashboard);

// ===============================
// REFERRAL MANAGEMENT
// ===============================

router.get("/referrals", protect, adminOnly, getReferralReport);

router.get("/referrals/:userId/users", protect, adminOnly, getReferredUsers);

// ===============================
// USER MANAGEMENT
// ===============================

router.get("/users", protect, adminOnly, getAdminUsers);

router.get("/users/:userId/profile", protect, adminOnly, getAdminUserProfile);

router.put(
  "/users/:userId/profile",
  protect,
  adminOnly,
  updateAdminUserProfile,
);

router.put(
  "/users/:userId/profile/images",
  protect,
  adminOnly,
  parseProfileImages,
  uploadAdminUserProfileImages,
);

router.patch("/users/:userId/verify", protect, adminOnly, verifyUserProfile);

router.patch(
  "/users/:userId/unverify",
  protect,
  adminOnly,
  unverifyUserProfile,
);

// ===============================
// ADMIN: USER GALLERY MANAGEMENT
// ===============================

router.get("/users/:userId/gallery", protect, adminOnly, getAdminUserGallery);

router.post(
  "/users/:userId/gallery",
  protect,
  adminOnly,
  parseGalleryImages,
  uploadAdminUserGallery,
);

router.put(
  "/users/:userId/gallery/:id",
  protect,
  adminOnly,
  parseGalleryImage,
  updateAdminUserGalleryImage,
);

router.delete(
  "/users/:userId/gallery/:id",
  protect,
  adminOnly,
  deleteAdminUserGalleryImage,
);

// ===============================
// ADMIN: USER PRODUCT MANAGEMENT
// ===============================

router.get("/users/:userId/products", protect, adminOnly, getAdminUserProducts);

router.post(
  "/users/:userId/products",
  protect,
  adminOnly,
  parseProductImages,
  createAdminUserProduct,
);

router.put(
  "/users/:userId/products/:id",
  protect,
  adminOnly,
  parseProductImages,
  updateAdminUserProduct,
);

router.delete(
  "/users/:userId/products/:id",
  protect,
  adminOnly,
  deleteAdminUserProduct,
);

// Change Password
router.put(
  "/settings/change-password",
  protect,
  adminOnly,
  changeAdminPassword,
);

// Get General Settings
router.get("/settings/general", protect, adminOnly, getAdminGeneralSettings);

// Update General Settings
router.put("/settings/general", protect, adminOnly, updateAdminGeneralSettings);
router.post(
  "/settings/general/upload-logo",
  protect,
  adminOnly,
  uploadWithField("image"),
  uploadAdminWebsiteLogo,
);
//logo
router.get("/settings/branding", getPublicBranding);
module.exports = router;
