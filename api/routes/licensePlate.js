const express = require("express");
const router = express.Router();
const { licensePlateController } = require("../controllers/licensePlate");

router.get("/:imgUrl", licensePlateController.getLicensePlate);

module.exports = router;
