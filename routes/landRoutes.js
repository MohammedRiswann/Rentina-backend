const express = require("express");
const router = express.Router();
const landsController = require("../controllers/landsController");

router.get("/lands-list", landsController.landsList);
router.get("/lands-details/:userId", landsController.landsDetails);

module.exports = router;
