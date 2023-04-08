var express = require("express");
var router = express.Router();
const {
  getProducts,
  getProduct,
  createProduct,
  deleteProduct,
  deleteAllProducts,
  getWishlist,
  addToWishlist,
  removeWishItem,
  getCart,
  addToCart,
  removeFromCart,
  getOrderHistory,
  addToOrderHistory,
  getAllOrders,
  deleteOrder,
  deleteAllOrders,
  getUserOrders,
  deleteUserOrder,
  deleteAllUserOrders,
} = require("../Controllers/productController");
const { auth } = require("../Middleware/auth");

/*****************MAIN(ADMIN)* PRODUCT ROUTES****************/
// GET ALL PRODUCTS
router.get("/", getProducts);

// GET PRODUCT BY SKU
router.get("/:id", getProduct);

// CREATE NEW PRODUCT
router.post("/create-product", createProduct);

// DELETE PRODUCT
router.delete("/delete/:id", deleteProduct);

// DELETE ALL PRODUCTS
router.delete("/delete-all", deleteAllProducts);

// GET ALL ORDERS

// DELETE AN ORDER

// DELETE ALL ORDERS

/*****************USER BASED PRODUCT ROUTES******************/

// GET WISHLIST
router.get("/wishlist", auth, getWishlist);

// ADD TO WISHLIST
router.put("/add-wishlist/:id", auth, addToWishlist);

// REMOVE FROM WISHLIST
router.put("/remove-wishlist/:id", auth, removeWishItem);

// GET CART
router.get("/cart", auth, getCart);

// ADD TO CART
router.put("/add-cart/:id", auth, addToCart);

// REMOVE FROM CART
router.put("/remove-cart/:id", auth, removeFromCart);

// ADD ORDER HISTORY
router.put("/add-history/:id", auth, addToOrderHistory);

// GET ORDER HISTORY
router.get("/history", auth, getOrderHistory);

// GET ALL ORDERS
router.get("/orders", getAllOrders);

// DELETE AN ORDER
router.delete("/orders/:id", deleteOrder);

// DELETE ALL ORDERS
router.delete("/orders", deleteAllOrders);

// GET USER ORDERS
router.get("/user-orders", auth, getUserOrders);

// DELETE USER ORDER
router.delete("/user-orders/:id", auth, deleteUserOrder);

// DELETE ALL USER ORDERS
router.delete("/user-orders", auth, deleteAllUserOrders);

module.exports = router;
