const MOTresponse200MockJSON = {
    registration: "AA19AAA",
    make: "FORD",
    model: "Focus",
    firstUsedDate: "2019-03-01",
    fuelType: "PETROL",
    primaryColour: "RED",
    registrationDate: "2019-03-01",
    manufactureDate: "2019-01-01",
    engineSize: "2000",
    hasOutstandingRecall: "No",
    motTests: [
        {
            completedDate: "2023-03-30T10:00:00.000Z",
            testResult: "PASSED",
            expiryDate: "2024-03-30",
            odometerValue: "30000",
            odometerUnit: "MI",
            odometerResultType: "READ",
            motTestNumber: "123456789012",
            dataSource: "DVSA",
            defects: [
                {
                    text: "Advisory: Slight corrosion on brake lines",
                    type: "ADVISORY",
                    dangerous: false,
                },
            ],
        },
        {
            completedDate: "2022-03-30T10:00:00.000Z",
            testResult: "PASSED",
            expiryDate: "2023-03-30",
            odometerValue: "25000",
            odometerUnit: "MI",
            odometerResultType: "READ",
            motTestNumber: "987654321098",
            dataSource: "DVSA",
            defects: [],
        },
    ],
};

const MOTresponse404MockJSON = {
    errorCode: "MOTH-NP-01",
    errorMessage: "Vehicle with identifier: [{*PLACEHOLDER*}] not found",
    requestId: "123-123-1234657",
};

module.exports = {
    MOTresponse200MockJSON,
    MOTresponse404MockJSON,
};
