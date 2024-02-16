const { default: mongoose, Mongoose } = require("mongoose");
const { any } = require("../middleware/multer");

const productsSchema = new mongoose.Schema({
  name: String,
  price: Number,
  images: {
    type: [String],
  },
});

const products = mongoose.model("products", productsSchema);
module.exports = products;
