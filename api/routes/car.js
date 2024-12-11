const express = require("express");
const router = express.Router();
const CarController = require("../controllers/car");

router.get("/test", CarController.test);

module.exports = router;
