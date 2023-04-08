const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const cartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
  sku: Number,
  image: String,
  name: String,
  modelNumber: String,
  quantity: Number,
  price: Number,
});

const Cart = mongoose.model("carts", cartSchema);

module.exports = Cart;
