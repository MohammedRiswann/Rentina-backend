const Review = require("../models/review.js");

const reviewController = {
  submitReview: async (request, response) => {
    try {
      console.log(request.body);
      const { rating, comment } = request.body.reviewData;
      const { id } = request.body;

      const review = new Review({ productId: id, rating, comment });
      console.log(review);
      await review.save();
      response.status(201).json({ message: "Review submitted successfully.." });
    } catch (error) {
      response.status(500).json({ error: "Failed to submit review" });
    }
  },
  getProductReviews: async (request, response) => {
    try {
      const productId = request.params.productId;
      console.log(productId, "hrlo");
      const reviews = await Review.find({ productId });
      console.log(reviews);
      response.status(200).json(reviews);
    } catch (error) {
      response.status(500).json({ error: "Failed to fetch reviews" });
    }
  },
};

module.exports = reviewController;
