var express = require("express");
var router = express.Router();
const {
  getProducts,
  createProduct,
  deleteAllProducts,
  getWishlist,
  addToWishlist,
  removeWishItem,
  getCart,
  addToCart,
  removeFromCart,
  getOrderHistory,
  addToOrderHistory,
} = require("../Controllers/productController");
const { auth } = require("../Middleware/auth");

/*****************MAIN(ADMIN)* PRODUCT ROUTES****************/
/* GET home page. */
router.get("/products", getProducts);

// CREATE NEW PRODUCT
router.post("/products/create-product", createProduct);

// DELETE ALL PRODUCTS
router.delete("/products/delete-all", deleteAllProducts);

// GET ALL ORDERS

// DELETE AN ORDER

// DELETE ALL ORDERS

/*****************USER BASED PRODUCT ROUTES******************/

// GET WISHLIST
router.get("/products/wishlist", auth, getWishlist);

// ADD TO WISHLIST
router.put("/products/add-wishlist/:id", auth, addToWishlist);

// REMOVE FROM WISHLIST
router.put("/products/remove-wishlist/:id", auth, removeWishItem);

// GET CART
router.get("/products/cart", auth, getCart);

// ADD TO CART
router.put("/products/add-cart/:id", auth, addToCart);

// REMOVE FROM CART
router.put("/products/remove-cart/:id", auth, removeFromCart);

// ADD ORDER HISTORY
router.put("/products/add-history/:id", auth, addToOrderHistory);

// GET ORDER HISTORY
router.get("/products/history", auth, getOrderHistory);

module.exports = router;
