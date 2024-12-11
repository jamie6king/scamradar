const express = require("express");
const router = express.Router();

const DvsaController = require("../controllers/Dvsa");

router.post("/get-new-token", async (req, res) => {
  try {
    await DvsaController.getNewToken();
    res.status(200).send("Token refreshed!");
  } catch (error) {
    res.status(500).send("Error refreshing token");
  }
});

router.get("/history/:registration", async (req, res) => {
  try {
    const motInfo = await DvsaController.getMotInfo();
    res.status(200).json(motInfo);
  } catch (error) {
    console.error("Error fetching MOT history", error);
    res.status(500).json({ message: "Error fetching MOT history" });
  }
});

module.exports = router;
