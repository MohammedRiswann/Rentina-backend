const { default: mongoose, Mongoose } = require("mongoose");

const sellerSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  phone: Number,
  password: String,
  otp: Number,
  photoUrl: String,
});

const seller = mongoose.model("Seller", sellerSchema);
module.exports = seller;
