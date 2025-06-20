const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    userName: {
      type: String,
      required: true
    },
    reviewMessage: {
      type: String,
      required: true
    },
    reviewValue: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Review", reviewSchema);
