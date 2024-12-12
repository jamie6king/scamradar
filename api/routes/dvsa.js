const express = require("express");
const router = express.Router();

const DvsaController = require("../controllers/dvsa");

// leave this route for now..manually grabs a new access token.
// router.post("/get-new-token", async (req, res) => {
//   try {
//     await DvsaController.getNewToken();
//     res.status(200).send("Token refreshed!");
//   } catch (error) {
//     res.status(500).send("Error refreshing token");
//   }
// });

router.get("/history/:registration", async (req, res) => {
    try {
        await DvsaController.getMotInfo(req, res);
    } catch (error) {
        console.error("Error fetching MOT history", error);
        res.status(500).json({ message: "Error fetching MOT history" });
    }
});

module.exports = router;
