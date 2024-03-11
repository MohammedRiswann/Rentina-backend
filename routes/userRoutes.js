const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

const validateSignup = require("../validation/passwordValidation");
const confirmPassword = require("../validation/confirmpassword");
const validatePhone = require("../validation/phoneValidation");
const validateInput = require("../validation/validateInoput");

router.get("/search/apartments", userController.propertyList);
router.get("/apartment-details/:userId", userController.apartmentDetails);

router.post("/signup", validateSignup, userController.Verification);
router.post("/verify-otp", userController.Register);
router.post("/user-login", userController.Login);

module.exports = router;
