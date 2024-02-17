const { default: mongoose, Mongoose } = require("mongoose");
const { any } = require("../middleware/multer");

const landsSchema = new mongoose.Schema({
  name: String,
  price: Number,
  images: {
    type: [String],
  },
  description: String,
  features: String,
  type: String,
  location: String,
  role: String,
});

const lands = mongoose.model("lands", landsSchema);
module.exports = lands;
