const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const multer = require("../middleware/multer");
const decode = require("../middleware/decodeJwt");

const validateSignup = require("../validation/passwordValidation");
const confirmPassword = require("../validation/confirmpassword");
const validatePhone = require("../validation/phoneValidation");
const validateInput = require("../validation/validateInoput");

router.get("/search/apartments", userController.propertyList);
router.get("/apartment-details/:userId", userController.apartmentDetails);
router.get("/get-payment-approved/:id", userController.getPaymentApproved);
router.get("/get-payment-pending/:id", userController.fetchPendingHome);

router.post("/signup", validateSignup, userController.Verification);
router.post("/verify-otp", userController.Register);
router.post("/user-login", userController.Login);
router.post(
  "/upload-id",
  multer.array("files", 1),
  decode,
  userController.upload
);
module.exports = router;
