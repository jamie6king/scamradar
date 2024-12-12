require("dotenv").config();

let cachedToken = null;
let tokenExpiryTime = null;

async function getValidToken() {
    const currentTime = Date.now();

    if (!cachedToken || currentTime >= tokenExpiryTime) {
        console.log("Token expired or not found, getting a new one....");
        await getNewToken();
    }

    return cachedToken;
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

        cachedToken = newAccessToken;
        tokenExpiryTime = Date.now() + expiresIn * 1000;

        console.log("Token refreshed and cached.");
    } catch (error) {
        console.error("Error refreshing the token", error);
        throw error;
    }
}

async function getMotInfo(req, res) {
    try {
        const accessToken = await getValidToken();

        const registration = req.params.registration;

        const response = await fetch(
            `https://history.mot.api.gov.uk/v1/trade/vehicles/registration/${registration}`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                    "X-API-Key": process.env.API_KEY,
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
        console.error("Error in getMotInfo function:", error);
        return res
            .status(500)
            .json({ message: "Internal server error", error: error.message });
    }
}

const DvsaController = {
    getNewToken: getNewToken,
    getValidToken: getValidToken,
    getMotInfo: getMotInfo,
};

module.exports = DvsaController;
