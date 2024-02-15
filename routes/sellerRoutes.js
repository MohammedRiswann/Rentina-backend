const express = require("express");
const router = express.Router();
const sellerController = require("../controllers/sellerController");
const validateSignup = require("../validation/passwordValidation");
const confirmPassword = require("../validation/confirmpassword");
const validatePhone = require("../validation/phoneValidation");
const validateInput = require("../validation/validateInoput");
const multer = require("../middleware/multer");

router.post("/register", sellerController.Verification);
router.post(
  "/verify-otp",
  multer.single("file"),
  sellerController.sellerRegister
);
router.post("/seller-login", sellerController.Login);

module.exports = router;
