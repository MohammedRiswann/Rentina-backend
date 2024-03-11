const { default: mongoose, Mongoose } = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  phone: Number,
  password: String,
  otp: Number,
  isVerified: Boolean,
  isAdmin: {
    type: Boolean,
    default: false,
  },
  isBlocked: {
    type: Boolean,
    default: false,
  },
});

const user = mongoose.model("User", userSchema);
module.exports = user;
