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

    let existingCart = await Cart.find({ user: req.user._id });

    let existingCartItem = existingCart.find(
      (item) => item.sku === product.sku
    );

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
      quantity: 1,
      regularPrice: product.regularPrice,
      salePrice: product.salePrice,
      price: paidPrice,
    });

    if (!existingCartItem) {
      await Cart.create(newCart);
      if (Cart.quantity === NaN) {
        await Cart.deleteOne(newCart);
      }
      res.status(200).json({
        message: "Product added to Cart",
      });
    } else {
      if (existingCartItem && existingCartItem.sku === newCart.sku) {
        await Cart.updateOne(
          { user: req.user._id, sku: product.sku },
          {
            $inc: {
              quantity: 1,
            },
            price: paidPrice * (existingCartItem.quantity + 1),
          }
        );
        res.json({
          message: "Product quantity updated",
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

// REMOVE FROM CART
const removeFromCart = async (req, res) => {
  try {
    const existingProduct = await Product.findOne({ sku: req.params.id });

    if (!existingProduct) {
      return res.status(400).json({ message: "Product not found" });
    }

    let existingCart = await Cart.find({ user: req.user._id });

    let existingCartItem = existingCart.find(
      (item) => item.sku === existingProduct.sku
    );

    if (!existingCartItem) {
      return res.status(400).json({ message: "Product not in cart" });
    } else {
      if (existingCartItem.quantity > 1) {
        await Cart.updateOne(
          { user: req.user._id, sku: req.params.id },
          {
            $inc: {
              quantity: -1,
            },
            price:
              existingCartItem.price -
              existingCartItem.price / existingCartItem.quantity,
          }
        );
        return res.json({ message: "Product quantity updated" });
      }
    }

    if (existingCartItem.quantity === 1) {
      await Cart.deleteOne({ user: req.user._id, sku: req.params.id });
      return res.status(200).json({
        message: "Product removed from Cart",
      });
    }
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// CLEAR CART
const clearQuantity = async (req, res) => {
  try {
    const existingCart = await Cart.find({ user: req.user._id });

    if (!existingCart) {
      return res.status(400).json({ message: "Cart is empty" });
    } else {
      await Cart.deleteOne({ sku: req.params.id });
      return res.status(200).json({
        message: "Item Quantity Cleared",
      });
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
  clearQuantity,
  clearCart,
};
