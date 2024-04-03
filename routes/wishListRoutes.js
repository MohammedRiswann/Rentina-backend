// wishlist.routes.js
const express = require("express");
const router = express.Router();
const wishlistController = require("../controllers/wishListController");
const decode = require("../middleware/decodeJwt");

// Wishlist routes
router.post("/add", decode, wishlistController.addToWishlist);
router.post("/remove", decode, wishlistController.removeFromWishlist);
router.get("/check/:productId", decode, wishlistController.checkWishlist);
router.get("/get-wishlist", decode, wishlistController.getWishlist);

module.exports = router;
