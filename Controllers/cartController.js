const User = require("../Models/userSchema");
const Cart = require("../Models/cartSchema");
const Product = require("../Models/productSchema");

// GET CART
const getCart = async (req, res) => {
  try {
    const cart = await Cart.find({ user: req.user._id });

    res.json({ success: true, cart });
  } catch (error) {
    return res.status(402).json({
      success: false,
      message: error.message,
    });
  }
};

// ADD TO CART
const addToCart = async (req, res) => {
  try {
    const product = await Product.findOne({ sku: req.params.id });

    if (!product) {
      return res.status(400).json({ message: "Product not found" });
    }

    let existingCart = await Cart.findOne({ sku: product.sku });

    let paidPrice =
      product.regularPrice > product.salePrice
        ? product.salePrice
        : product.regularPrice;

    const newCart = new Cart({
      user: req.user._id,
      sku: product.sku,
      image: product.image,
      product: product.product,
      modelNumber: product.modelNumber,
      quantity: product.quantity,
      price: paidPrice,
    });

    if (
      existingCart &&
      existingCart.user.toString() !== req.user._id.toString()
    ) {
      return res.status(401).json({ message: "Not authorized" });
    } else {
      if (!existingCart) {
        await Cart.create(newCart);
        res.status(200).json({
          message: "Product added to Cart",
        });
      } else if (existingCart && existingCart.sku === newCart.sku) {
        await Cart.updateOne(
          { sku: product.sku },
          {
            $inc: {
              quantity: 1,
            },
            price: paidPrice * (existingCart.quantity + 1),
          }
        );
        res.json({ message: "Product quantity updated" });
      }
    }
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// REMOVE FROM CART
const removeFromCart = async (req, res) => {
  try {
    const existingProduct = await Product.findOne({ sku: req.params.id });
    if (!existingProduct) {
      return res.status(400).json({ message: "Product not found" });
    }

    const existingCart = await Cart.findOne({ sku: req.params.id });

    if (existingCart.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    } else {
      if (!existingCart) {
        return res.status(400).json({ message: "Product not in cart" });
      } else {
        if (existingCart.quantity > 1) {
          await Cart.updateOne(
            { sku: req.params.id },
            {
              $inc: {
                quantity: -1,
              },
              price:
                existingCart.price - existingCart.price / existingCart.quantity,
            }
          );
          return res.json({ message: "Product quantity updated" });
        }
      }

      if (existingCart.quantity === 1) {
        await Cart.deleteOne({ sku: req.params.id });
        return res.status(200).json({
          message: "Product removed from Cart",
        });
      }
    }
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// CLEAR CART
const clearCart = async (req, res) => {
  try {
    const existingCart = await Cart.find({ user: req.user._id });

    if (!existingCart) {
      return res.status(400).json({ message: "Cart is empty" });
    } else {
      await Cart.deleteMany({ user: req.user._id });
      return res.status(200).json({
        message: "Cart cleared",
      });
    }
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getCart,
  addToCart,
  removeFromCart,
  clearCart,
};
