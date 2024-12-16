const getCompanyHouseJson = require("../services/companiesHouse");

async function companyReport(req, res) {
    const companyNumber = req.body.companyNumber;
    if (!companyNumber) {
        return res.status(400).json({
            reportResults: "Couldn't find companyNumber?",
        });
    }

    const companyData = await getCompanyHouseJson(companyNumber);
    if (companyData) {
        return res.status(200).json({
            reportResults: companyData,
        });
    } else {
        return res.status(404).json({
            reportResults: "Record for company not found",
        });
    }
}

const CompaniesHouseController = {
    companyReport: companyReport,
};

module.exports = CompaniesHouseController;
