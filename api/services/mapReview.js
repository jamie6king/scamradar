/* eslint-disable n/no-unsupported-features/node-builtins */
require("dotenv").config();

const getMapReviewJSON = async (query) => {
    try {
        const params = new URLSearchParams({
            engine: "google_maps",
            q: query,
            api_key: process.env.SERPAPI_API_KEY,
        });
        const response = await fetch(
            `https://serpapi.com/search?${params.toString()}`
        );
        const data = await response.json();
        return data;
    } catch (error) {
        console.log(`\n${error.message}\n`);
    }
};

module.exports = getMapReviewJSON;
