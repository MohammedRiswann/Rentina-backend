const express = require("express");
const router = express.Router();
const sellerController = require("../controllers/sellerController");
const validateSignup = require("../validation/passwordValidation");
const confirmPassword = require("../validation/confirmpassword");
const validatePhone = require("../validation/phoneValidation");
const validateInput = require("../validation/validateInoput");
const multer = require("../middleware/multer");
const decode = require("../middleware/decodeJwt");

router.get("/apartments-list/:id", sellerController.getAllApartments);
router.get("/apartments-details/:id", sellerController.getProductDetails);
router.get("/profile", decode, sellerController.getProfile);
router.get("/lands-list/:id", sellerController.getAllLands);
router.get("/lands-details/:id", sellerController.getLandDetails);

router.post(
  "/register",

  multer.single("files"),
  sellerController.Verification
);
router.post("/verify-otp", decode, sellerController.sellerRegister);
router.post("/seller-login", sellerController.Login);
router.post(
  "/add-products",
  decode,
  multer.array("files", 7),

  sellerController.addProducts
);
router.post(
  "/add-lands",
  decode,
  multer.array("files", 7),
  sellerController.addLands
);
router.post("/add-profile", decode, sellerController.addProfile);

router.delete("/apartments-list/:id", sellerController.deleteApartment);
router.delete("/lands-delete/:id", sellerController.deleteLand);
router.put("properties/:id", sellerController.updateProperty);
router.put("/block-unblock/:id", sellerController.BlockAndUnblock);

module.exports = router;
