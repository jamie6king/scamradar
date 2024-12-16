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

const MOTresponse200MockJSONwithTestFailures = {
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
            completedDate: "2023-11-29T15:11:28.000Z",
            expiryDate: "2024-11-28",
            odometerValue: "186913",
            odometerUnit: "MI",
            odometerResultType: "READ",
            testResult: "PASSED",
            dataSource: "DVSA",
            defects: [
                {
                    dangerous: false,
                    text: "Nearside Track rod end ball joint has slight play (2.1.3 (b) (i))",
                    type: "ADVISORY",
                },
            ],
        },
        {
            completedDate: "2023-11-29T15:11:27.000Z",
            expiryDate: null,
            odometerValue: "186913",
            odometerUnit: "MI",
            odometerResultType: "READ",
            testResult: "FAILED",
            dataSource: "DVSA",
            defects: [
                {
                    dangerous: false,
                    text: "Nearside Track rod end ball joint has slight play (2.1.3 (b) (i))",
                    type: "ADVISORY",
                },
                {
                    dangerous: false,
                    text: "Nearside Rear Tyre has a cut in excess of the requirements deep enough to reach the ply or cords (5.2.3 (d) (i))",
                    type: "PRS",
                },
            ],
        },
        {
            completedDate: "2022-11-17T15:45:09.000Z",
            expiryDate: "2023-11-23",
            odometerValue: "166642",
            odometerUnit: "MI",
            odometerResultType: "READ",
            testResult: "PASSED",
            dataSource: "DVSA",
            defects: [
                {
                    dangerous: false,
                    text: "Wipers poor",
                    type: "ADVISORY",
                },
                {
                    dangerous: false,
                    text: "Windscreen damaged but not adversely affecting driver's view (3.2 (a) (i))",
                    type: "MINOR",
                },
                {
                    dangerous: false,
                    text: "Offside Front Anti-roll bar linkage ball joint has slight play (5.3.4 (a) (i))",
                    type: "ADVISORY",
                },
                {
                    dangerous: false,
                    text: "Offside Rear Brake hose has slight corrosion to ferrule (1.1.12 (f) (i))",
                    type: "ADVISORY",
                },
                {
                    dangerous: false,
                    text: "Nearside Front Tyre worn close to legal limit/worn on edge (5.2.3 (e))",
                    type: "ADVISORY",
                },
            ],
        },
        {
            completedDate: "2022-11-17T15:45:08.000Z",
            expiryDate: null,
            odometerValue: "166642",
            odometerUnit: "MI",
            odometerResultType: "READ",
            testResult: "FAILED",
            dataSource: "DVSA",
            defects: [
                {
                    dangerous: false,
                    text: "Wipers poor",
                    type: "ADVISORY",
                },
                {
                    dangerous: false,
                    text: "Windscreen damaged but not adversely affecting driver's view (3.2 (a) (i))",
                    type: "MINOR",
                },
                {
                    dangerous: false,
                    text: "Nearside Stop lamp(s) not working (4.3.1 (a) (ii))",
                    type: "PRS",
                },
                {
                    dangerous: false,
                    text: "Offside Stop lamp(s) not working (4.3.1 (a) (ii))",
                    type: "PRS",
                },
                {
                    dangerous: false,
                    text: "Front Registration plate does not conform to the specified requirements (0.1 (d))",
                    type: "PRS",
                },
                {
                    dangerous: false,
                    text: "Rear Registration plate does not conform to the specified requirements (0.1 (d))",
                    type: "PRS",
                },
                {
                    dangerous: false,
                    text: "Offside Front Anti-roll bar linkage ball joint has slight play (5.3.4 (a) (i))",
                    type: "ADVISORY",
                },
                {
                    dangerous: false,
                    text: "Offside Rear Brake hose has slight corrosion to ferrule (1.1.12 (f) (i))",
                    type: "ADVISORY",
                },
                {
                    dangerous: false,
                    text: "Nearside Front Tyre worn close to legal limit/worn on edge (5.2.3 (e))",
                    type: "ADVISORY",
                },
            ],
        },
        {
            completedDate: "2021-11-24T12:39:41.000Z",
            expiryDate: "2022-11-23",
            odometerValue: "150273",
            odometerUnit: "MI",
            odometerResultType: "READ",
            testResult: "PASSED",
            dataSource: "DVSA",
            defects: [
                {
                    dangerous: false,
                    text: "Headlamp lens slightly defective both (4.1.1 (b) (i))",
                    type: "MINOR",
                },
                {
                    dangerous: false,
                    text: "Front Registration plate deteriorated but not likely to be misread (0.1 (b))",
                    type: "ADVISORY",
                },
            ],
        },
    ],
};

module.exports = {
    MOTresponse200MockJSON,
    MOTresponse404MockJSON,
    MOTresponse200MockJSONwithTestFailures,
};
