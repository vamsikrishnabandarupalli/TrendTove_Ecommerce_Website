const Product = require("../../models/Product");

// Helper to safely parse array-type query params
const parseArrayQueryParam = (param) => {
  if (!param) return [];
  return typeof param === "string" ? param.split(",") : param;
};

const getFilteredProducts = async (req, res) => {
  try {
    const category = parseArrayQueryParam(req.query.category);
    const brand = parseArrayQueryParam(req.query.brand);
    const sortBy = (req.query.sortBy || "price-lowtohigh").toLowerCase();

    const filters = {};

    if (category.length) {
      filters.category = { $in: category };
    }

    if (brand.length) {
      filters.brand = { $in: brand };
    }

    let sort = {};

    switch (sortBy) {
      case "price-lowtohigh":
        sort.price = 1;
        break;
      case "price-hightolow":
        sort.price = -1;
        break;
      case "title-atoz":
        sort.title = 1;
        break;
      case "title-ztoa":
        sort.title = -1;
        break;
      default:
        sort.price = 1;
        break;
    }

    const products = await Product.find(filters).sort(sort);

    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong while fetching products.",
    });
  }
};

const getProductDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong while fetching product details.",
    });
  }
};

module.exports = {
  getFilteredProducts,
  getProductDetails,
};
