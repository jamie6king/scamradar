const express = require("express");
const router = express.Router();
const CarController = require("../controllers/car");

router.get("/test", CarController.test);
router.post("/", CarController.carReport);

module.exports = router;
