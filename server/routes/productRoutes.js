const express = require("express");
const router = express.Router();
const {
  getProducts,
  getProductById,
  getFilterOptions,
} = require("../controllers/productController");

router.get("/", getProducts);
router.get("/filters/options", getFilterOptions); // ":id" se pehle hona zaroori hai
router.get("/:id", getProductById);

module.exports = router;