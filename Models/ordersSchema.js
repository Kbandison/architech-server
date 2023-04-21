const { v4: uuidv4 } = require("uuid");
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip: { type: Number, required: true },
  },
  phoneNumber: String,
  orderNumber: { type: String, default: uuidv4 },
  orderDate: { type: Date, default: Date.now },
  orderStatus: {
    type: String,
    default: "pending",
    enum: ["pending", "shipped", "delivered"],
  },
  orderTotal: Number,
  orderSavings: Number,
  orderItems: [
    {
      product: {
        sku: Number,
        image: String,
        name: String,
        modelNumber: String,
        quantity: { type: Number, default: 1 },
        regularPrice: Number,
        salePrice: Number,
        totalPrice: Number,
      },
    },
  ],
});

const Order = mongoose.model("orders", orderSchema);

module.exports = Order;
