const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

router.get("/seller-list", adminController.getSeller);
router.get("/user-list", adminController.getUserList);
router.get("/seller-profile/:userId", adminController.getProfile);
router.get("/user-profile/:userId", adminController.getUserProfile);
router.get("/apartments-list/:userId", adminController.getAllApartments);
router.get("/lands-list/:userId", adminController.getAllLands);
router.get(
  "/apartments-details/:apartmentId",
  adminController.apartmentDetails
);
router.get("/land-details/:landId", adminController.landDetails);
router.get("/pending-seller-list", adminController.pendingApproval);

router.patch("/approve-seller/:sellerId", adminController.approveSeller);

router.delete("/delete-land/:id", adminController.deleteLand);

router.post("/send-email", adminController.sendEmail);

router.put("/block-unblock/:id", adminController.BlockAndUnblock);
module.exports = router;
