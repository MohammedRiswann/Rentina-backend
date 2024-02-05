const { default: mongoose, Mongoose } = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  phoneNumber: Number,
  password: String,
  otp: Number,
});

const user = mongoose.model("User", userSchema);
module.exports = user;
