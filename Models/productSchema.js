const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const productSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    // required: true,
  },
  id: { type: String, default: uuidv4 },
  sku: Number,
  product: String,
  manufacturer: String,
  name: String,
  longDescription: String,
  regularPrice: Number,
  salePrice: Number,
  category: Array,
  color: String,
  height: String,
  width: String,
  depth: String,
  clearance: Boolean,
  image: String,
  addToCartUrl: String,
  new: Boolean,
  productTemplate: String,
  customerReviewCount: Number,
  customerReviewAverage: Number,
  onSale: Boolean,
  freeShipping: Boolean,
  shippingCost: Number,
  shippingLevelsOfService: Array,
  department: String,
  modelNumber: String,
  images: Array,
  alternateViewsImage: String,
  warrantyLabor: String,
  warrantyParts: String,
});

const Product = mongoose.model("products", productSchema);

module.exports = Product;
