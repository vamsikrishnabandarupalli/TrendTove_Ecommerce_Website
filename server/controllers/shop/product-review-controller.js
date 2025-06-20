// controllers/shop/review-controller.js
const Order = require("../../models/Orders");
const Product = require("../../models/Product");
const ProductReview = require("../../models/Review");

const addProductReview = async (req, res) => {
  try {
    const { productId, reviewMessage, reviewValue } = req.body;
    const userId = req.user.id; 
    const userName = req.user.name; 

    
    const order = await Order.findOne({
      userId,
      "cartItems.productId": productId,
      orderStatus: { $in: ["confirmed", "delivered"] }
    });
    if (!order) {
      return res.status(403).json({
        success: false,
        message: "You must purchase this product to leave a review."
      });
    }

    // Prevent duplicate review
    const existingReview = await ProductReview.findOne({ productId, userId });
    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this product."
      });
    }

    // Create new review
    const newReview = new ProductReview({
      productId,
      userId,
      userName,
      reviewMessage,
      reviewValue
    });
    await newReview.save();

    // Update average review rating on Product
    const allReviews = await ProductReview.find({ productId });
    const totalReviews = allReviews.length;
    const averageReview =
      totalReviews > 0
        ? allReviews.reduce((sum, r) => sum + r.reviewValue, 0) / totalReviews
        : 0;

    await Product.findByIdAndUpdate(productId, { averageReview });

    return res.status(201).json({
      success: true,
      message: "Review added successfully.",
      data: newReview
    });
  } catch (error) {
    console.error("Review error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error."
    });
  }
};

const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const reviews = await ProductReview.find({ productId }).sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      data: reviews
    });
  } catch (error) {
    console.error("Fetch reviews error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch product reviews."
    });
  }
};

module.exports = {
  addProductReview,
  getProductReviews
};
