const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const userSchema = new mongoose.Schema({
  id: { type: String, default: uuidv4 },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  confirmPassword: { type: String },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip: { type: Number, required: true },
  },
  phoneNumber: String,
  wishlist: { type: Array, default: [] },
  cart: { type: Array, default: [] },
  orderHistory: { type: Array, default: [] },
  scope: { type: String, enum: ["customer", "employee", "admin"] },
  createdAt: { type: Date, default: Date.now },
  updatedAt: Date,
});

const User = mongoose.model("users", userSchema);

module.exports = User;
