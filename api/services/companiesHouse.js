/* eslint-disable n/no-unsupported-features/node-builtins */

const dotenv = require("dotenv");
dotenv.config();

const COMPANIES_HOUSE_API_URL = process.env.COMPANIES_HOUSE_API_URL;
const CH_API_KEY = process.env.CH_API_KEY;

// console.log("COMPANIES_HOUSE_API_URL:", COMPANIES_HOUSE_API_URL);
// console.log("CH_API_KEY:", CH_API_KEY);

async function getCompanyHouseJson(companyNumber) {
    const url = `${COMPANIES_HOUSE_API_URL}/${companyNumber}`;

    const requestOptions = {
        method: "GET",
        headers: {
            Authorization: CH_API_KEY,
            "Content-Type": "application/json",
        },
    };
    const response = await fetch(url, requestOptions);
    if (response.status === 200) {
        const data = await response.json();
        return {
            company_name: data.company_name,
            company_number: data.company_number,
            company_status: data.company_status,
            confirmation_statement: {
                last_made_up_to: data.confirmation_statement.last_made_up_to,
                next_due: data.confirmation_statement.next_due,
                next_made_up_to: data.confirmation_statement.next_made_up_to,
                overdue: data.confirmation_statement.overdue,
            },
            date_of_creation: data.date_of_creation,
            has_charges: data.has_charges,
            has_been_liquidated: data.has_been_liquidated,
        };
    } else if (response.status === 404) {
        const data = await response.json();
        return data;
    } else {
        throw new Error("unable to connect to Companies House");
    }
}

module.exports = getCompanyHouseJson;

// (async () => {
//     const response = await getCompanyHouseJson("09278648");
//     console.log(response);
// })();
