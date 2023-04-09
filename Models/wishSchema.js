const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const wishSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
  sku: Number,
  image: String,
  product: String,
  modelNumber: String,
  price: Number,
});

const WishItem = mongoose.model("wishlists", wishSchema);

module.exports = WishItem;
