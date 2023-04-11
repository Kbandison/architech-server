const express = require("express");
const router = express.Router();
const {
  getCart,
  addToCart,
  removeFromCart,
  clearCart,
} = require("../Controllers/cartController");
const { auth } = require("../Middleware/auth");

// GET CART
router.get("/", auth, getCart);

// ADD TO CART
router.post("/add-cart/:id", auth, addToCart);

// REMOVE FROM CART
router.delete("/remove-cart/:id", auth, removeFromCart);

// CLEAR CART
router.delete("/clear-cart", auth, clearCart);

module.exports = router;
