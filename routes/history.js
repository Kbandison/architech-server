const express = require("express");
const router = express.Router();
const {
  getUserHistory,
  getAllHistory,
  addToHistory,
} = require("../Controllers/historyController");
const { auth } = require("../Middleware/auth");

// GET ALL HISTORY
router.get("/", getAllHistory);

// GET USER HISTORY
router.get("/user-history", auth, getUserHistory);

// ADD TO HISTORY
router.post("/add-history/:id", addToHistory);

module.exports = router;
