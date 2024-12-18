const { getDvlaJson, findDvlaJson, saveDvlaJson } = require("../services/car");
const { getMotInfo, findDvsaJson, saveDvsaJson } = require("../services/dvsa");
const DvlaResponse = require("../models/dvla");

function test(req, res) {
    res.status(200).json({ message: "Car route test" });
}

async function carReport(req, res) {
    const registrationNumber = req.body.registrationNumber;
    if (!registrationNumber) {
        return res.status(400).json({
            reportResults:
                "Couldn't find registrationNumber, did you send this in the request body?",
        });
    }
    const vehicleData = req.body.vehicleData;
    if (!vehicleData) {
        return res.status(200).json({
            reportResults: "No comparisons can be made",
        });
    }
    let dvlaResponse = await findDvlaJson(registrationNumber);
    if (!dvlaResponse) {
        dvlaResponse = await getDvlaJson(registrationNumber);
        if (dvlaResponse.errors) {
            return res.status(404).json({
                reportResults: "Record for vehicle not found",
            });
        } else {
            await saveDvlaJson(dvlaResponse, registrationNumber);
        }
    }
    let dvsaResponse = await findDvsaJson(registrationNumber);
    if (!dvsaResponse) {
        dvsaResponse = await getMotInfo(registrationNumber);
        await saveDvsaJson(dvsaResponse, registrationNumber);
    }
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
        fuelType: () => {
            if (!vehicleData.fuelType) {
                return `No data provided. fuel type is ${dvlaResponse.fuelType}`;
            }
            if (dvlaResponse.fuelType === vehicleData.fuelType.toUpperCase()) {
                return "Pass";
            } else {
                return `Fail: should be ${dvlaResponse.fuelType}`;
            }
        },
        registrationDate: () => {
            if (!vehicleData.registrationDate) {
                return `No data provided. registration date is ${dvsaResponse.registrationDate.slice(0, 4)}`;
            }
            if (
                dvsaResponse.registrationDate.slice(0, 4) ===
                vehicleData.registrationDate
            ) {
                return "Pass";
            } else {
                return `Fail: should be ${dvsaResponse.registrationDate.slice(0, 4)}`;
            }
        },
        mileage: () => {
            if (!dvsaResponse.motTests) {
                return "No MOT history, mileage cannot be confirmed";
            } else if (!vehicleData.mileage) {
                return `No data provided. last MOT mileage was ${dvsaResponse.motTests[0].odometerValue} miles`;
            } else if (
                Number(dvsaResponse.motTests[0].odometerValue) <=
                Number(vehicleData.mileage)
            ) {
                return "Pass";
            } else {
                return `Fail: should be ${dvsaResponse.motTests[0].odometerValue} miles`;
            }
        },
        taxStatus: () => {
            return dvlaResponse.taxStatus;
        },
        hasOutstandingRecall: () => {
            return dvsaResponse.hasOutstandingRecall;
        },
        motData: () => {
            const motRequired = dvsaResponse.motTestDueDate !== null;
            let motTestDueDate = null;
            if (motRequired) {
                if (!dvsaResponse.motTests) {
                    motTestDueDate = dvsaResponse.motTestDueDate;
                } else if (dvsaResponse.motTests[0].testResult === "PASSED") {
                    motTestDueDate = dvsaResponse.motTests[0]["expiryDate"];
                } else {
                    motTestDueDate = "Latest MOT failed";
                }
            }
            let motFailures = [];
            let mileageHistory = [];
            if (dvsaResponse.motTests) {
                // console.log(dvsaResponse.motTests);
                motFailures = dvsaResponse.motTests
                    .filter((motTest) => {
                        return motTest.testResult === "FAILED";
                    })
                    .map((motTest) => {
                        return {
                            ...motTest,
                            defects: motTest.defects.filter(
                                (defect) => defect.type !== "ADVISORY"
                            ),
                        };
                    });
            }
            return {
                motRequired: motRequired,
                motTestDueDate: motTestDueDate,
                motFailures: motFailures,
            };
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
        reportResults: resolvedCarReportJson,
    });
}

const CarController = {
    test: test,
    carReport: carReport,
};

module.exports = CarController;
