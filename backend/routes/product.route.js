const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/auth.middleware");

const {
  createProduct,
  getMyProducts,
  updateProduct,
  deleteProduct,
  parseProductImages,
} = require("../controllers/product.controller");

// Product routes
router.post("/", protect, parseProductImages, createProduct);
router.get("/my-products", protect, getMyProducts);
router.put("/:id", protect, parseProductImages, updateProduct);
router.delete("/:id", protect, deleteProduct);

module.exports = router;
