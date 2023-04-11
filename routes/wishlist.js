const express = require("express");
const router = express.Router();
const {
  getWishlist,
  addToWishlist,
  removeWishItem,
  clearWishlist,
} = require("../Controllers/wishController");
const { auth } = require("../Middleware/auth");

// GET WISHLIST
router.get("/", auth, getWishlist);

// ADD TO WISHLIST
router.post("/add-wish/:id", auth, addToWishlist);

// REMOVE FROM WISHLIST
router.delete("/remove-wish/:id", auth, removeWishItem);

// CLEAR WISHLIST
router.delete("/clear-wish", auth, clearWishlist);

module.exports = router;
