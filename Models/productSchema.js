const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  SKU: Number,
  product: String,
  manufacturer: String,
  name: String,
  longDescription: String,
  regularPrice: Number,
  salePrice: Number,
  category: Array,
  subCategory: String,
  brand: String,
  color: String,
  height: String,
  width: String,
  depth: String,
  clearance: Boolean,
  quantity: Number,
  image: String,
  addToCartUrl: String,
  new: Boolean,
  productTemplate: String,
  customerReviewCount: Number,
  customerReviewAverage: Number,
  onSale: Boolean,
  freeShipping: Boolean,
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
