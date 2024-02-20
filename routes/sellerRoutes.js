const express = require("express");
const router = express.Router();
const sellerController = require("../controllers/sellerController");
const validateSignup = require("../validation/passwordValidation");
const confirmPassword = require("../validation/confirmpassword");
const validatePhone = require("../validation/phoneValidation");
const validateInput = require("../validation/validateInoput");
const multer = require("../middleware/multer");
const decode = require("../middleware/decodeJwt");

router.get("/apartments-list", sellerController.getAllApartments);
router.get("/apartments-list/:id", sellerController.getProductDetails);
router.get("/profile", decode, sellerController.getProfile);

router.post("/register", multer.single("files"), sellerController.Verification);
router.post("/verify-otp", sellerController.sellerRegister);
router.post("/seller-login", sellerController.Login);
router.post(
  "/add-products",
  multer.array("files", 7),
  sellerController.addProducts
);
router.post(
  "/add-lands",
  multer.array("files", 7),
  sellerController.addProducts
);
router.post("/add-profile", decode, sellerController.addProfile);

router.delete("/apartments-list/:id", sellerController.deleteApartment);
router.put("properties/:id", sellerController.updateProperty);

module.exports = router;
