const { default: mongoose, Mongoose } = require("mongoose");

const sellerSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  phone: Number,
  password: String,
  otp: Number,
});

const seller = mongoose.model("sellers", sellerSchema);
module.exports = seller;
