const User = require("../Models/userSchema");
const Wish = require("../Models/wishSchema");
const Product = require("../Models/productSchema");

// GET WISHLIST
const getWishlist = async (req, res) => {
  try {
    const wishlist = await Wish.find({ user: req.user._id });

    res.json({ success: true, wishlist });
  } catch (error) {
    return res.status(402).json({
      success: false,
      message: error.message,
    });
  }
};

// ADD TO WISHLIST
const addToWishlist = async (req, res) => {
  const existingProduct = await Product.findOne({ sku: req.params.id });

  if (!existingProduct) {
    return res.status(400).json({ message: "Product not found" });
  }

  const existingWish = await Wish.findOne({ sku: req.params.id });

  let paidPrice =
    existingProduct.regularPrice > existingProduct.salePrice
      ? existingProduct.salePrice
      : existingProduct.regularPrice;

  const newWish = new Wish({
    user: req.user._id,
    sku: existingProduct.sku,
    image: existingProduct.image,
    product: existingProduct.product,
    modelNumber: existingProduct.modelNumber,
    price: paidPrice,
  });

  if (
    existingWish &&
    existingWish.user.toString() !== req.user._id.toString()
  ) {
    return res.status(401).json({ message: "Not authorized" });
  }

  if (!existingWish) {
    await Wish.create(newWish);
    res.status(200).json({
      message: "Product added to wishlist",
    });
  } else {
    return res.status(400).json({ message: "Product already in wishlist" });
  }
};

// REMOVE FROM WISHLIST
const removeWishItem = async (req, res) => {
  const existingProduct = await Product.findOne({ sku: req.params.id });

  if (!existingProduct) {
    return res.status(400).json({ message: "Product not found" });
  }

  const existingWish = await Wish.findOne({ sku: req.params.id });

  if (!existingWish) {
    return res.status(400).json({ message: "Product not in wishlist" });
  }

  if (existingWish.user.toString() !== req.user._id.toString()) {
    return res.status(401).json({ message: "Not authorized" });
  } else {
    await Wish.deleteOne({ sku: req.params.id });
  }

  res.status(200).json({
    message: "Product removed from wishlist",
  });
};

// CLEAR WISHLIST
const clearWishlist = async (req, res) => {
  try {
    await Wish.deleteMany({ user: req.user._id });

    res.status(200).json({
      message: "Wishlist cleared",
    });
  } catch (error) {
    return res.status(402).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getWishlist,
  addToWishlist,
  removeWishItem,
  clearWishlist,
};
