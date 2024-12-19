const express = require("express");
const cors = require("cors");
const carRouter = require("./routes/car");
const businessRouter = require("./routes/business");
const companiesHouseRouter = require("./routes/companiesHouse");
const mapReviewRouter = require("./routes/mapReview");
const licensePlateRouter = require("./routes/licensePlate");
const scrapeIframeRouter = require("./routes/scrapeIframe");

//const usersRouter = require("./routes/users");

const app = express();

// Allow requests from any client
// docs: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
// docs: https://expressjs.com/en/resources/middleware/cors.html
app.use(cors());

// Parse JSON request bodies, made available on `req.body`
app.use(express.json());

// API Routes
app.use("/car", carRouter);
app.use("/business", businessRouter);
app.use("/companiesHouse", companiesHouseRouter);
app.use("/mapReview", mapReviewRouter);
app.use("/getLicensePlate", licensePlateRouter);
app.use("/scrapeIframeUrl", scrapeIframeRouter);

// 404 Handler
app.use((_req, res) => {
    res.status(404).json({ err: "Error 404: Not Found" });
});

module.exports = app;
