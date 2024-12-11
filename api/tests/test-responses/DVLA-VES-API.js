const DVLAresponse200MockJSON = {
    registrationNumber: "AA19AAA",
    artEndDate: "2025-03-30",
    co2Emissions: 300,
    engineCapacity: 2000,
    euroStatus: "EURO1",
    markedForExport: false,
    fuelType: "PETROL",
    motStatus: "No details held by DVLA",
    revenueWeight: 0,
    colour: "RED",
    make: "FORD",
    typeApproval: "M1",
    yearOfManufacture: 2019,
    taxDueDate: "<1 YEAR FROM NOW>",
    taxStatus: "Taxed",
    dateOfLastV5CIssued: "2019-05-20",
    wheelplan: "2 AXLE RIGID BODY",
    monthOfFirstDvlaRegistration: "2019-03",
    monthOfFirstRegistration: "2019-03",
    realDrivingEmissions: "1",
};

const DVLAresponse404MockJSON = {
    errors: [
        {
            status: "404",
            code: "404",
            title: "Vehicle Not Found",
            detail: "Record for vehicle not found",
        },
    ],
};

module.exports = {
    DVLAresponse200MockJSON,
    DVLAresponse404MockJSON,
};
