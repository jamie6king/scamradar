require("dotenv").config();
const DvsaToken = require("../models/dvsa");

async function saveOrUpdateToken(token, expiresIn) {
  try {
    const currentTime = Date.now();
    const expirationTime = currentTime + expiresIn * 1000;

    let tokenData = await DvsaToken.findOne();
    if (tokenData) {
      const tokenExpiryTime =
        tokenData.last_update.getTime() + tokenData.expires_in * 1000;

      if (expirationTime >= tokenExpiryTime) {
        console.log("token expired, getting a new one....");
        tokenData.access_token = token;
        tokenData.expires_in = expiresIn;
        tokenData.last_update = new Date();
        await tokenData.save();
        console.log("Token is updated!");
      } else {
        console.log("Token is still valid.");
      }
    } else {
      const newToken = new DvsaToken({
        access_token: token,
        expires_in: expiresIn,
        last_update: new Date(),
      });
      await newToken.save();
      console.log("First token saved successfully!!");
    }
  } catch (error) {
    console.error("Error saving or updating your token", error);
  }
}

async function getNewToken() {
  try {
    const response = await fetch(`${process.env.TOKEN_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        scope: "https://tapi.dvsa.gov.uk/.default",
        grant_type: "client_credentials",
      }),
    });
    if (!response.ok) {
      throw new Error("Failed to refresh token");
    }

    const data = await response.json();

    const newAccessToken = data.access_token;
    const expiresIn = data.expires_in;

    await saveOrUpdateToken(newAccessToken, expiresIn);

    console.log("token refreshed and updated.");
    console.log(newAccessToken);
  } catch (error) {
    console.error("error refreshed the token", error);
  }
}

async function getMotInfo(req, res) {
  try {
    const token = await DvsaToken.findOne();

    if (!token) {
      return res.status(400).json({ message: "Token not found" });
    }

    const registration = req.params.registration;

    const response = await fetch(
      `https://history.mot.api.gov.uk/v1/trade/vehicles/registration/${registration}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token.access_token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({
        message: "Error fetching MOT data",
        error: errorText,
      });
    }
    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error("Error in test function:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
}

const DvsaController = {
  getNewToken: getNewToken,
  saveOrUpdateToken: saveOrUpdateToken,
  getMotInfo: getMotInfo,
};

module.exports = DvsaController;
