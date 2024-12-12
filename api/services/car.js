/* eslint-disable n/no-unsupported-features/node-builtins */
const dotenv = require("dotenv");
dotenv.config();

const DVLA_URL = process.env.DVLA_URL;
const DVLA_API_KEY = process.env.DVLA_API_KEY;

async function getDvlaJson(registrationNumber) {
    const payload = {
        registrationNumber: registrationNumber,
    };
    const requestOptions = {
        method: "POST",
        headers: {
            "x-api-key": DVLA_API_KEY,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    };
    const response = await fetch(DVLA_URL, requestOptions);

    if (response.status == 200 || response.status == 404) {
        const data = await response.json();
        return data;
    } else {
        throw new Error("Unable to fetch DVLA details");
    }
}

// (async () => {
//     const response = await getDvlaJson("SD59 LDJ");
//     console.log(response);
// })();

module.exports = getDvlaJson;
