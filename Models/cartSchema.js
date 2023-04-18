const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const cartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
  id: { type: String, default: uuidv4 },
  sku: Number,
  image: String,
  product: String,
  modelNumber: String,
  quantity: { type: Number, default: 1 },
  regularPrice: Number,
  salePrice: Number,
  price: Number,
});

const Cart = mongoose.model("carts", cartSchema);

module.exports = Cart;
