const express = require("express");
const router = express.Router();
const { mapReviewController } = require("../controllers/mapReviews");

router.get("/:companyName/:postcode", mapReviewController.findMapReview);

module.exports = router;
