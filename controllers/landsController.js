const Lands = require("../models/lands");

const landsController = {
  landsList: async (request, response) => {
    try {
      const { query, location, minPrice, maxPrice, type } = request.query;

      let apartmentsQuery = {};

      if (query) {
        apartmentsQuery.$or = [
          { name: { $regex: new RegExp(query, "i") } },
          { location: { $regex: new RegExp(query, "i") } },
        ];
      }
      if (location) {
        apartmentsQuery.location = { $regex: new RegExp(location, "i") };
      }
      if (minPrice && !maxPrice) {
        apartmentsQuery.price = { $gte: minPrice };
      } else if (!minPrice && maxPrice) {
        apartmentsQuery.price = { $lte: maxPrice };
      } else if (minPrice && maxPrice) {
        apartmentsQuery.price = { $gte: minPrice, $lte: maxPrice };
      }

      if (type) {
        apartmentsQuery.type = type.toLowerCase();
      }

      const lands = await Lands.find(apartmentsQuery);
      console.log(lands);
      response.json(lands);
    } catch (error) {
      console.error(error);
      response.status(500).json({ message: "Internal server error" });
    }
  },
  landsDetails: async (request, response) => {
    try {
      const apartmentId = request.params.userId;
      console.log(apartmentId);
      const apartmentDetails = await Lands.findById(apartmentId);
      response.json(apartmentDetails);
    } catch (error) {
      console.log(error);
    }
  },
};

module.exports = landsController;
