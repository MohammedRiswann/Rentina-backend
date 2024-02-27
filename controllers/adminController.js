const Seller = require("../models/seller");

const adminController = {
  getSeller: async (request, response) => {
    try {
      const sellers = await Seller.find();
      response.json(sellers);
    } catch (error) {
      console.error("Error fetching sellers:", error);
      response.status(500).json({ message: "Internal server error" });
    }
  },
};
module.exports = adminController;
