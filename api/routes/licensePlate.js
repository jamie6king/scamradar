const express = require("express");
const router = express.Router();
const { licensePlateController } = require("../controllers/licensePlate");

router.get("/", licensePlateController.getLicensePlate);

module.exports = router;
