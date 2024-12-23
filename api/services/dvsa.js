/* eslint-disable n/no-unsupported-features/node-builtins */
require("dotenv").config();
const DvsaResponse = require("../models/dvsa");

let cachedToken = null;
let tokenExpiryTime = null;

async function getMotInfo(registration) {
    const currentTime = Date.now();

    if (!cachedToken || currentTime >= tokenExpiryTime) {
        console.log("Token expired or not found, getting a new one....");
        try {
            const response = await fetch(`${process.env.DVSA_TOKEN_URL}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: new URLSearchParams({
                    client_id: process.env.DVSA_CLIENT_ID,
                    client_secret: process.env.DVSA_CLIENT_SECRET,
                    scope: "https://tapi.dvsa.gov.uk/.default",
                    grant_type: "client_credentials",
                }),
            });

            const data = await response.json();
            cachedToken = data.access_token;
            tokenExpiryTime = Date.now() + data.expires_in * 1000;
            console.log("Token refreshed and cached.");
        } catch (error) {
            console.error(`Error refreshing the token: ${error.message}`);
            throw new Error(`Error refreshing the token: ${error.message}`);
        }
    }

    try {
        const response = await fetch(
            `https://history.mot.api.gov.uk/v1/trade/vehicles/registration/${registration}`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${cachedToken}`,
                    "Content-Type": "application/json",
                    "X-API-Key": process.env.DVSA_API_KEY,
                },
            }
        );
        // console.log(cachedToken);

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error fetching MOT data: ${errorText}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error in getMotInfo function:", error);
        throw new Error(`Internal server error: ${error.message}`);
    }
}

async function findDvsaJson(registrationNumber) {
    const dvsaResponse = await DvsaResponse.findOne({
        numberPlate: registrationNumber,
    });
    if (dvsaResponse) {
        return dvsaResponse.dvsaResponse;
    } else {
        return dvsaResponse;
    }
}

async function saveDvsaJson(dvsaResponse, numberPlate) {
    const dvsaEntry = new DvsaResponse({
        numberPlate: numberPlate,
        dvsaResponse: dvsaResponse,
    });
    await dvsaEntry.save();
}

// (async () => {
//     const response = await getMotInfo("av21lbe");
//     console.log(response);
// })();

module.exports = {
    getMotInfo: getMotInfo,
    findDvsaJson: findDvsaJson,
    saveDvsaJson: saveDvsaJson,
};
