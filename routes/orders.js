const express = require("express");
const router = express.Router();
const {
  getUserOrders,
  createOrder,
  deleteUserOrder,
  deleteAllUserOrders,
} = require("../Controllers/ordersController");
const { auth } = require("../Middleware/auth");

// GET USER ORDERS
router.get("/", auth, getUserOrders);

// ADD ORDERS
router.post("/add-order", auth, createOrder);

// DELETE USER ORDER
router.delete("/remove-order/:id", auth, deleteUserOrder);

// DELETE ALL USER ORDERS
router.delete("/clear-orders", auth, deleteAllUserOrders);

module.exports = router;
