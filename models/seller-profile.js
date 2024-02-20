const { default: mongoose, Mongoose } = require("mongoose");
const { any } = require("../middleware/multer");

const sellerProfileSchema = new mongoose.Schema({
  userId: mongoose.Types.ObjectId,
  firstName: String,
  lastName: String,
  email: String,
  phone: Number,
  country: String,
  state: String,
});

const sellerProfile = mongoose.model("sellerProfile", sellerProfileSchema);
module.exports = sellerProfile;
