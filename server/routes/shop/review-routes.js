const express = require("express");
const { verifyToken } = require("../../middlewares/verifyToken");
const {
  addProductReview,
  getProductReviews,
} = require("../../controllers/shop/product-review-controller");

const router = express.Router();

router.post("/add", verifyToken, addProductReview);
router.get("/:productId", getProductReviews);

module.exports = router;
