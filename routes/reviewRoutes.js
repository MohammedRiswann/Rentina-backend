// review.routes.js
const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");

router.post("/submit", reviewController.submitReview);
router.get("/products/:productId", reviewController.getProductReviews);

module.exports = router;
