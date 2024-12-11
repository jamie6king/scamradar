const express = require("express");
const router = express.Router();
const BusinessController = require("../controllers/business");

router.get("/test", BusinessController.test);

module.exports = router;
