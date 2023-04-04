const Product = require("../Models/productSchema");
const User = require("../Models/userSchema");

// GET PRODUCTS
const getProducts = async (req, res) => {
  try {
    const url =
      "https://api.bestbuy.com/v1/products/6523167.json?apiKey=wqeLbseHZors9FmRbSXM6Ugv";
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
      warrantyLabor: data.warrantyLabor,
      warrantyParts: data.warrantyParts,
    };

    res.json(newProduct);
  } catch (err) {
    res.json({ message: err });
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

module.exports = {
  getProducts,
  createProduct,
};
