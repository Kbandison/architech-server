const Product = require("../Models/productSchema");
const User = require("../Models/userSchema");

/*****************MAIN(ADMIN)* PRODUCT ROUTES****************/
// GET PRODUCTS
const getProducts = async (req, res) => {
  try {
    const url =
      "https://api.bestbuy.com/v1/products((categoryPath.id=abcat0101000))?apiKey=wqeLbseHZors9FmRbSXM6Ugv&pageSize=50&format=json";
    const response = await fetch(url);
    const data = await response.json();
    const products = data.products;

    // const user = req.user._id;
    let newProduct;

    for (let item of products) {
      newProduct = new Product({
        // user,
        sku: item.sku,
        product: item.name,
        manufacturer: item.manufacturer,
        name: item.albumTitle,
        longDescription: item.longDescription,
        regularPrice: item.regularPrice,
        salePrice: item.salePrice,
        category: item.categoryPath,
        color: item.color,
        height: item.height,
        width: item.width,
        depth: item.depth,
        clearance: item.clearance,
        image: item.image,
        addToCartUrl: item.addToCartUrl,
        new: item.new,
        productTemplate: item.productTemplate,
        customerReviewCount: item.customerReviewCount,
        customerReviewAverage: item.customerReviewAverage,
        onSale: item.onSale,
        freeShipping: item.freeShipping,
        shippingCost: item.shippingCost,
        shippingLevelsOfService: item.shippingLevelsOfService,
        department: item.department,
        modelNumber: item.modelNumber,
        images: item.images,
        alternateViewsImage: item.alternateViewsImage,
        warrantyLabor: item.warrantyLabor,
        warrantyParts: item.warrantyParts,
      });

      const existingProduct = await Product.findOne({ sku: item.sku });

      if (!existingProduct) {
        await Product.create(newProduct);
      }
    }

    const allProducts = await Product.find({});

    res.json(allProducts);
  } catch (err) {
    res.json({ message: err.message });
  }
};

// CREATE NEW PRODUCT (MAY NOT BE NEEDED)
const createProduct = async (req, res) => {
  try {
    const url =
      "https://api.bestbuy.com/v1/products/6454218.json?apiKey=wqeLbseHZors9FmRbSXM6Ugv";
    // const products = await Product.find();
    const response = await fetch(url);
    const data = await response.json();

    const newProduct = {
      SKU: data.sku,
      product: data.name,
      manufacturer: data.manufacturer,
      name: data.albumTitle,
      longDescription: data.longDescription,
      regularPrice: data.regularPrice,
      salePrice: data.salePrice,
      color: data.color,
      height: data.height,
      width: data.width,
      depth: data.depth,
      clearance: data.clearance,
      quantity: data.quantity,
      image: data.image,
      addToCartUrl: data.addToCartUrl,
      new: data.new,
      category: data.categoryPath,
      modelNumber: data.modelNumber,
      productTemplate: data.productTemplate,
      customerReviewCount: data.customerReviewCount,
      customerReviewAverage: data.customerReviewAverage,
      onSale: data.onSale,
      freeShipping: data.freeShipping,
      shippingCost: data.shippingCost,
      shippingLevelsOfService: data.shippingLevelsOfService,
      department: data.department,
      images: data.images,
      alternateViewsImage: data.alternateViewsImage,
      quantityLimit: data.quantityLimit,
      warrantyLabor: data.warrantyLabor,
      warrantyParts: data.warrantyParts,
    };

    const product = new Product(newProduct);

    await product.save();
    res.json(product);
  } catch (err) {
    res.json({ message: err });
  }
};

// DELETE ALL PRODUCTS
const deleteAllProducts = async (req, res) => {
  try {
    const products = await Product.deleteMany();
    res.json(products);
  } catch (err) {
    res.json({ message: err });
  }
};

// GET ALL ORDERS

// DELETE AN ORDER

// DELETE ALL ORDERS

/*****************USER BASED PRODUCT ROUTES******************/

/*******WISHLIST******/

// GET WISHLIST
const getWishlist = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  const wishlist = user.wishlist;

  res.status(200).json(wishlist);
};

// ADD TO WISHLIST
const addToWishlist = async (req, res) => {
  const existingProduct = await Product.findOne({ sku: req.params.id });

  if (!existingProduct) {
    return res.status(400).json({ message: "Product not found" });
  }

  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  let wishlist = user.wishlist;

  if (wishlist.includes(existingProduct._id)) {
    return res.status(400).json({
      message: "Product already in wishlist",
    });
  }

  // wishlist.push(existingProduct._id);

  await User.findByIdAndUpdate(req.user._id, {
    wishlist: [...wishlist, existingProduct],
  });

  res.status(200).json({
    message: "Product added to wishlist",
  });
};

// REMOVE FROM WISHLIST
const removeWishItem = async (req, res) => {
  const existingProduct = await Product.findOne({ sku: req.params.id });

  if (!existingProduct) {
    return res.status(400).json({ message: "Product not found" });
  }

  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  let wishlist = user.wishlist;

  let filteredWishlist = wishlist.filter(
    (item) => item.sku !== existingProduct.sku
  );

  let checked = wishlist.map((item) => item.sku === existingProduct.sku);
  console.log(checked);

  if (!checked.includes(true)) {
    return res.status(400).json({
      message: "Product not in wishlist",
    });
  }

  await User.findByIdAndUpdate(req.user._id, {
    wishlist: filteredWishlist,
  });

  res.status(200).json({
    message: "Product removed from wishlist",
  });
};

/*********CART**********/

// GET CART
const getCart = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  const cart = user.cart;

  res.status(200).json(cart);
};

// ADD TO CART
const addToCart = async (req, res) => {
  const existingProduct = await Product.findOne({ sku: req.params.id });

  if (!existingProduct) {
    return res.status(400).json({ message: "Product not found" });
  }

  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  let cart = user.cart;

  if (cart.includes(existingProduct._id)) {
    return res.status(400).json({
      message: "Product already in Cart",
    });
  }

  await User.findByIdAndUpdate(req.user._id, {
    cart: [...cart, existingProduct],
  });

  res.status(200).json({
    message: "Product added to Cart",
  });
};

// ADD TO BEST BUY CART

// REMOVE FROM CART
const removeFromCart = async (req, res) => {
  const existingProduct = await Product.findOne({ sku: req.params.id });

  if (!existingProduct) {
    return res.status(400).json({ message: "Product not found" });
  }

  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  let cart = user.cart;

  let filteredCart = cart.filter((item) => item.sku !== existingProduct.sku);

  let checked = cart.map((item) => item.sku === existingProduct.sku);
  console.log(checked);

  if (!checked.includes(true)) {
    return res.status(400).json({
      message: "Product not in wishlist",
    });
  }

  await User.findByIdAndUpdate(req.user._id, {
    cart: filteredCart,
  });

  res.status(200).json({
    message: "Product removed from Cart",
  });
};

/*********ORDER HISTORY**********/

// GET ORDER HISTORY
const getOrderHistory = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  const history = user.orderHistory;

  res.status(200).json(history);
};

// ADD TO ORDER HISTORY
const addToOrderHistory = async (req, res) => {
  const existingProduct = await Product.findOne({ sku: req.params.id });

  if (!existingProduct) {
    return res.status(400).json({ message: "Product not found" });
  }

  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  let orderHistory = user.orderHistory;
  let cart = user.cart;

  if (orderHistory.includes(existingProduct._id)) {
    return res.status(400).json({
      message: "Product already in History",
    });
  }

  await User.findByIdAndUpdate(req.user._id, {
    cart: cart.filter((item) => item.sku !== existingProduct.sku),
  });

  await User.findByIdAndUpdate(req.user._id, {
    orderHistory: [...orderHistory, existingProduct],
  });

  res.status(200).json({
    message: "Product added to History",
    cart,
    orderHistory,
  });
};

module.exports = {
  getProducts,
  createProduct,
  deleteAllProducts,
  getWishlist,
  addToWishlist,
  removeWishItem,
  getCart,
  addToCart,
  removeFromCart,
  getOrderHistory,
  addToOrderHistory,
};
