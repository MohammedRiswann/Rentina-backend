const Review = require("../models/review.js");
const Report = require("../models/report.js");

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
  submitReport: async (request, response) => {
    try {
      const { reason } = request.body.reportData;
      const { id } = request.body;
      console.log(reason);
      //   console.log(request.token);
      const { userId } = request.token;
      console.log(userId);

      const report = new Report({ id, reason, userId });
      await report.save();
      response.status(201).json({ message: "Report submitted successfully." });
    } catch (error) {
      console.error("Failed to submit report:", error);
      response.status(500).json({ error: "Failed to submit report" });
    }
  },
};

module.exports = reviewController;
