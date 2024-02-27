const { default: mongoose, Mongoose } = require("mongoose");
const { any } = require("../middleware/multer");

const productsSchema = new mongoose.Schema({
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

productsSchema.index({ name: "text", text: true });

const products = mongoose.model("products", productsSchema);
module.exports = products;
