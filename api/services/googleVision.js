/* eslint-disable n/no-unsupported-features/node-builtins */
const dotenv = require("dotenv");
dotenv.config();

const GOOGLE_VISION_URL = process.env.GOOGLE_VISION_URL;
const GOOGLE_VISION_API_KEY = process.env.GOOGLE_VISION_API_KEY;

const getGoogleVisionText = async (imgUrl) => {
    const requestBody = {
        requests: [
            {
                image: {
                    source: {
                        imageUri: imgUrl,
                    },
                },
                features: [
                    {
                        type: "TEXT_DETECTION",
                        maxResults: 10,
                    },
                ],
            },
        ],
    };
    try {
        const response = await fetch(`${GOOGLE_VISION_URL}`, {
            method: "POST",
            headers: {
                "x-goog-api-key": GOOGLE_VISION_API_KEY,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
        });
        if (!response.ok) {
            throw new Error(`Request error, status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error calling GooglevisionAPI:", error);
    }
};

module.exports = getGoogleVisionText;
