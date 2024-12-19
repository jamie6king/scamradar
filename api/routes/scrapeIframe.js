const express = require("express");
const router = express.Router();
const { scrapeIframeController } = require("../controllers/scrapeIframe");

router.get("/getIframeUrl", scrapeIframeController.getIframeUrlFromEbayUrl);
router.get(
    "/getBusinessInfo",
    scrapeIframeController.getBusinessInfoFromIframeUrl
);

module.exports = router;


// app.use("/scrapeIframeUrl", scrapeIframeRouter);