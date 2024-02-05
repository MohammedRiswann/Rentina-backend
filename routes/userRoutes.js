const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

const validateSignup = require("../validation/passwordValidation");
const confirmPassword = require("../validation/confirmpassword");
const validatePhone = require("../validation/phoneValidation");
const validateInput = require("../validation/validateInoput");

router.post(
  "/signup",
  validateSignup,
  confirmPassword,
  validatePhone,
  validateInput,

  userController.Verification
);
router.post("/verify-otp", userController.Register);
router.post("/user-login", userController.Login);

module.exports = router;
