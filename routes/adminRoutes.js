const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

router.get("/seller-list", adminController.getSeller);

module.exports = router;
