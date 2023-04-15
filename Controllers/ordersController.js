const User = require("../Models/userSchema");
const Order = require("../Models/ordersSchema");
const Cart = require("../Models/cartSchema");

// GET USER ORDERS
const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id });

    res.json({ success: true, orders });
  } catch (err) {
    res.json({ message: err });
  }
};

// CREATE ORDER
const createOrder = async (req, res) => {
  try {
    const cart = await Cart.find({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const existingOrder = await Order.find({ user: req.user._id });

    let totalPrice = 0;

    cart.map((item) => {
      return (totalPrice += item.price);
    });

    let orderItems = (item) => {
      return {
        product: {
          sku: item.sku,
          image: item.image,
          name: item.product,
          modelNumber: item.modelNumber,
          quantity: item.quantity,
          totalPrice: item.price,
        },
      };
    };

    const newOrder = new Order({
      user: req.user._id,
      orderStatus: "pending",
      orderItems: [...cart.map(orderItems)],
      orderTotal: totalPrice,
    });

    await Order.create(newOrder);

    await Cart.deleteMany({ user: req.user._id });

    res.json({ message: "Order created", newOrder });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE USER ORDER
const deleteUserOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ orderNumber: req.params.id });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (
      order.user.toString() !== req.user._id.toString() ||
      req.user.scope !== "admin"
    ) {
      return res.status(401).json({ message: "Not authorized" });
    } else {
      await Order.deleteOne(order);
      res.json({ message: "Order deleted", order });
    }
  } catch (err) {
    res.json({ message: err });
  }
};

// DELETE ALL USER ORDERS
const deleteAllUserOrders = async (req, res) => {
  try {
    const orders = await Order.deleteMany({ user: req.user._id });

    res.json({ message: "All orders deleted", orders });
  } catch (err) {
    res.json({ message: err });
  }
};

module.exports = {
  getUserOrders,
  createOrder,
  deleteUserOrder,
  deleteAllUserOrders,
};
