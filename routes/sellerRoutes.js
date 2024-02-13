const express = require("express");
const router = express.Router();
const sellerController = require("../controllers/sellerController");
const validateSignup = require("../validation/passwordValidation");
const confirmPassword = require("../validation/confirmpassword");
const validatePhone = require("../validation/phoneValidation");
const validateInput = require("../validation/validateInoput");

router.post(
  "/register",

  sellerController.Verification
);
router.post("/verify-otp", sellerController.sellerRegister);
module.exports = router;
