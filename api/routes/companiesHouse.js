const express = require("express");
const router = express.Router();
const CompanyHouseController = require("../controllers/companiesHouse");

router.post("/", CompanyHouseController.companyReport);

module.exports = router;
