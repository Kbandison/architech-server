const { v4: uuidv4 } = require("uuid");
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
  orderNumber: { type: String, default: uuidv4 },
  orderDate: { type: Date, default: Date.now },
  orderStatus: { type: String, enum: ["pending", "shipped", "delivered"] },
  orderTotal: Number,
  orderItems: [
    {
      product: {
        sku: Number,
        image: String,
        name: String,
        modelNumber: String,
        quantity: Number,
        singlePrice: Number,
        totalPrice: Number,
      },
    },
  ],
});

const Order = mongoose.model("orders", orderSchema);

module.exports = Order;
