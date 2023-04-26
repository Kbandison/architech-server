const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const historySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  address: Object,
  phoneNumber: String,
  orderNumber: { type: String },
  orderDate: { type: Date },
  deliveredDate: { type: Date, default: Date.now },
  orderStatus: { type: String, default: "delivered" },
  orderTotal: Number,
  orderSavings: Number,
  orderItems: Array,
});

const History = mongoose.model("histories", historySchema);

module.exports = History;
