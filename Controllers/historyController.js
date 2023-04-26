const History = require("../Models/historySchema");
const Order = require("../Models/ordersSchema");

const getUserHistory = async (req, res) => {
  try {
    const history = await History.find({ user: req.user._id });

    res.status(200).json(history);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const getAllHistory = async (req, res) => {
  try {
    const history = await History.find();

    res.status(200).json(history);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const addToHistory = async (req, res) => {
  const existingOrder = await Order.findOne({
    orderNumber: req.params.id,
  });

  if (!existingOrder) {
    return res.status(400).json({ message: "Order not found" });
  }

  const newHistory = new History({
    user: existingOrder.user,
    firstName: existingOrder.firstName,
    lastName: existingOrder.lastName,
    email: existingOrder.email,
    address: existingOrder.address,
    phoneNumber: existingOrder.phoneNumber,
    orderNumber: existingOrder.orderNumber,
    orderDate: existingOrder.orderDate,
    orderStatus: "delivered",
    orderTotal: existingOrder.orderTotal,
    orderSavings: existingOrder.orderSavings,
    orderItems: existingOrder.orderItems,
  });

  if (existingOrder.orderStatus === "delivered") {
    await History.create(newHistory);
    await Order.deleteOne({ orderNumber: existingOrder.orderNumber });

    res.json({ success: true, message: "Order added to history" });
  } else {
    return res.status(400).json({ message: "Order not delivered yet" });
  }

  // res.status(200).json({
  //   // existingOrder,
  //   message: "Order added to history",
  // });
};

module.exports = {
  getUserHistory,
  getAllHistory,
  addToHistory,
};
