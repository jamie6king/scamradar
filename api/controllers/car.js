const getDvlaJson = require("../services/car");

function test(req, res) {
    res.status(200).json({ message: "Car route test" });
}

async function carReport(req, res) {
    const registrationNumber = req.body.registrationNumber;
    if (!registrationNumber) {
        return res.status(400).json({
            message:
                "Couldn't find registrationNumber, did you send this in the request body?",
        });
    }
    const vehicleData = req.body.vehicleData;
    if (!vehicleData) {
        return res.status(200).json({
            message: "No comparisons can be made",
        });
    }

    const dvlaResponse = await getDvlaJson(registrationNumber);
    const reportArray = Object.entries(vehicleData).map(([key, value]) => {
        const dvlaResponseLowerKey = (dvlaResponse[key] || "").toLowerCase();
        if (dvlaResponseLowerKey == value.toLowerCase()) {
            return [key, "Pass"];
        } else if (dvlaResponseLowerKey == "") {
            return [key, "Fail, no data found"];
        } else {
            return [key, `Fail, ${key} should be: ${dvlaResponseLowerKey}`];
        }
    });
    const reportObject = Object.fromEntries(reportArray);
    return res.status(200).json({
        message: reportObject,
    });
}

const CarController = {
    test: test,
    carReport: carReport,
};

module.exports = CarController;
