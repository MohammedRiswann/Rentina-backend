const Wishlist = require("../models/wishList");
const Lands = require("../models/lands");
const mongoose = require("mongoose");

module.exports = {
  addToWishlist: async (request, response) => {
    try {
      console.log(request.body);
      console.log("helo");
      const { productId } = request.body;
      const { userId } = request.token;

      console.log(productId);
      console.log(userId);

      const existingWishlistItem = await Wishlist.findOne({
        userId,
        productId,
      });

      if (existingWishlistItem) {
        return response
          .status(400)
          .json({ error: "Product already exists in the wishlist." });
      }

      // Create a new wishlist item
      const wishlistItem = new Wishlist({ userId, productId });
      await wishlistItem.save();

      // Send success response
      response
        .status(201)
        .json({ message: "Product added to wishlist successfully." });
    } catch (error) {
      console.error("Failed to add product to wishlist:", error);
      response
        .status(500)
        .json({ error: "Failed to add product to wishlist." });
    }
  },

  removeFromWishlist: async (request, response) => {
    try {
      console.log(request.body);
      const { productId } = request.body;
      console.log(productId);

      await Wishlist.findByIdAndDelete(productId);

      response
        .status(200)
        .json({ message: "Product removed from wishlist successfully." });
    } catch (error) {
      console.error("Failed to remove product from wishlist:", error);
      response
        .status(500)
        .json({ error: "Failed to remove product from wishlist." });
    }
  },
  checkWishlist: async (request, response) => {
    try {
      const { productId } = request.params;
      const { userId } = request.token; // Assuming you have userId in the token

      const isInWishlist = await Wishlist.exists({
        userId,
        products: productId,
      });

      res.status(200).json(isInWishlist);
    } catch (error) {
      console.error("Failed to check wishlist:", error);
      res.status(500).json({ error: "Failed to check wishlist" });
    }
  },
  getWishlist: async (request, response) => {
    try {
      const userId = request.token.userId;
      console.log("User ID:", userId);

      const wishlistItems = await Wishlist.aggregate([
        { $match: { userId: new mongoose.Types.ObjectId(userId) } },
        {
          $lookup: {
            from: "lands",
            localField: "productId",
            foreignField: "_id",
            as: "land",
          },
        },
        {
          $lookup: {
            from: "products",
            localField: "productId",
            foreignField: "_id",
            as: "apartments",
          },
        },
      ]);

      console.log("Wishlist Items:", wishlistItems);
      response.status(200).json(wishlistItems);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      response.status(500).json({ message: "Internal server error" });
    }
  },
};
