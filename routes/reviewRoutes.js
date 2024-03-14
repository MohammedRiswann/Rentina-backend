// review.routes.js
const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");
const decode = require("../middleware/decodeJwt");

router.post("/submit", reviewController.submitReview);
router.get("/products/:productId", reviewController.getProductReviews);
router.post("/report", decode, reviewController.submitReport);

module.exports = router;
