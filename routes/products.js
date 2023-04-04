var express = require("express");
var router = express.Router();
const {
  getProducts,
  createProduct,
} = require("../Controllers/productController");

/* GET home page. */
router.get("/products", getProducts);

// CREATE NEW PRODUCT
router.post("/products/create-product", createProduct);

module.exports = router;
