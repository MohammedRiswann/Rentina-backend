const { default: mongoose, Mongoose } = require("mongoose");
const { any } = require("../middleware/multer");

const sellerSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  phone: Number,
  password: String,
  otp: Number,
  profileImage: String,
  isVerified: Boolean,
});

const seller = mongoose.model("sellers", sellerSchema);
module.exports = seller;
