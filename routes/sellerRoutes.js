const express = require("express");
const router = express.Router();
const sellerController = require("../controllers/sellerController");
const validateSignup = require("../validation/passwordValidation");
const confirmPassword = require("../validation/confirmpassword");
const validatePhone = require("../validation/phoneValidation");
const validateInput = require("../validation/validateInoput");
const multer = require("../middleware/multer");

router.post("/register", multer.single("files"), sellerController.Verification);
router.post("/verify-otp", sellerController.sellerRegister);
router.post("/seller-login", sellerController.Login);
router.post(
  "/add-products",
  multer.array("files", 7),
  sellerController.addProducts
);

module.exports = router;
