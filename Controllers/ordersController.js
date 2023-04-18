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

// GET ALL ORDERS
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();

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
          regularPrice: item.regularPrice,
          salePrice: item.salePrice,
          totalPrice: item.price,
        },
      };
    };

    let orderSavings = 0;

    cart.map((item) => {
      if (item.regularPrice > item.salePrice) {
        orderSavings += (item.regularPrice - item.salePrice) * item.quantity;
      }
    });

    console.log(orderSavings);

    const newOrder = new Order({
      user: req.user._id,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      orderStatus: "pending",
      orderItems: [...cart.map(orderItems)],
      orderTotal: totalPrice,
      orderSavings,
    });

    await Order.create(newOrder);

    await Cart.deleteMany({ user: req.user._id });

    res.json({ message: "Order created", newOrder });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// UPDATE ORDER STATUS
const updateOrderStatus = async (req, res) => {
  const existingOrder = await Order.findOne({ orderNumber: req.params.id });

  if (!existingOrder) {
    return res.status(404).json({ message: "Order not found" });
  }

  if (req.user.scope !== "admin") {
    return res.status(401).json({ message: "Not authorized" });
  } else {
    const updatedOrder = await Order.updateOne(existingOrder, {
      ...Order,
      orderStatus: req.body.orderStatus,
    });

    res.json({ message: "Order updated", updatedOrder });
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
    let orders;

    if (req.user.scope !== "admin") {
      orders = await Order.deleteMany({ user: req.user._id });
    } else {
      return res.status(401).json({ message: "Not authorized" });
    }

    res.json({ message: "All orders deleted", orders });
  } catch (err) {
    res.json({ message: err });
  }
};

module.exports = {
  getUserOrders,
  getAllOrders,
  createOrder,
  updateOrderStatus,
  deleteUserOrder,
  deleteAllUserOrders,
};
