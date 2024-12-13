const getDvlaJson = require("../services/car");
const getMotInfo = require("../services/dvsa");

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
    if (dvlaResponse.errors) {
        return res.status(404).json({
            message: "Record for vehicle not found",
        });
    }
    const dvsaResponse = await getMotInfo(registrationNumber);

    const carReportJson = {
        make: () => {
            if (!vehicleData.make) {
                return `No data provided. Make is ${dvlaResponse.make}`;
            }
            if (dvlaResponse.make === vehicleData.make.toUpperCase()) {
                return "Pass";
            } else {
                return `Fail: should be ${dvlaResponse.make}`;
            }
        },
        model: () => {
            if (!vehicleData.model) {
                return `No data provided. Model is ${dvsaResponse.model.toUpperCase()}`;
            }
            if (
                dvsaResponse.model.toUpperCase() ===
                vehicleData.model.toUpperCase()
            ) {
                return "Pass";
            } else {
                return `Fail: should be ${dvsaResponse.model.toUpperCase()}`;
            }
        },
        colour: () => {
            if (!vehicleData.colour) {
                return `No data provided. Colour is ${dvlaResponse.colour}`;
            }
            if (dvlaResponse.colour === vehicleData.colour.toUpperCase()) {
                return "Pass";
            } else {
                return `Fail: should be ${dvlaResponse.colour}`;
            }
        },
    };

    const resolvedCarReportJson = Object.keys(carReportJson).reduce(
        (acc, key) => {
            acc[key] = carReportJson[key]();
            return acc;
        },
        {}
    );

    // const reportArray = Object.entries(vehicleData).map(([key, value]) => {
    //     const dvlaResponseLowerKey = (dvlaResponse[key] || "").toLowerCase();
    //     if (dvlaResponseLowerKey == value.toLowerCase()) {
    //         return [key, "Pass"];
    //     } else if (dvlaResponseLowerKey == "") {
    //         return [key, "Fail, no data found"];
    //     } else {
    //         return [key, `Fail, ${key} should be: ${dvlaResponseLowerKey}`];
    //     }
    // });
    // const reportObject = Object.fromEntries(reportArray);

    return res.status(200).json({
        message: resolvedCarReportJson,
    });
}

const CarController = {
    test: test,
    carReport: carReport,
};

module.exports = CarController;
