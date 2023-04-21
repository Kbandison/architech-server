const express = require("express");
const router = express.Router();
const {
  getUserOrders,
  getAllOrders,
  getOrders,
  createOrder,
  updateOrderStatus,
  deleteUserOrder,
  deleteAllUserOrders,
} = require("../Controllers/ordersController");
const { auth } = require("../Middleware/auth");

// GET USER ORDERS
router.get("/", auth, getUserOrders);

// GET ALL ORDERS
router.get("/all-orders", getAllOrders);

// GET USER ORDERS
router.get("/user-orders/:id", getOrders);

// ADD ORDERS
router.post("/add-order", auth, createOrder);

// UPDATE ORDER STATUS
router.put("/update-status/:id", auth, updateOrderStatus);

// DELETE USER ORDER
router.delete("/remove-order/:id", auth, deleteUserOrder);

// DELETE ALL USER ORDERS
router.delete("/clear-orders", auth, deleteAllUserOrders);

module.exports = router;
