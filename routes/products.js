var express = require("express");
var router = express.Router();
const {
  getProducts,
  getProduct,
  createProduct,
  deleteProduct,
  deleteAllProducts,
  getAllOrders,
  deleteOrder,
  deleteAllOrders,
} = require("../Controllers/productController");
const { auth } = require("../Middleware/auth");

/*****************MAIN(ADMIN)* PRODUCT ROUTES****************/
// GET ALL PRODUCTS
router.get("/", getProducts);

// GET PRODUCT BY SKU
router.get("/:id", getProduct);

// // CREATE NEW PRODUCT
router.post("/create-product", createProduct);

// DELETE PRODUCT
router.delete("/delete/:id", deleteProduct);

// DELETE ALL PRODUCTS
router.delete("/delete-all", deleteAllProducts);

// GET ALL ORDERS
router.get("/orders", getAllOrders);

// DELETE AN ORDER
router.delete("/orders/:id", deleteOrder);

// DELETE ALL ORDERS
router.delete("/orders", deleteAllOrders);

module.exports = router;
