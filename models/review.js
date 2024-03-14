const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Types.ObjectId,
    ref: "Product",
    required: true,
  },

  rating: {
    type: Number,
    required: true,
  },
  comment: {
    type: String,
  },
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
