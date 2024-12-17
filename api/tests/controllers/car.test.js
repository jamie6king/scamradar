/* eslint-disable n/no-unsupported-features/node-builtins */
const request = require("supertest");
const jestFetchMock = require("jest-fetch-mock");
const app = require("../../app");
const {
    DVLAresponse200MockJSON,
    DVLAresponse404MockJSON,
} = require("../test-responses/DVLA-VES-API");
const {
    MOTresponse200MockJSON,
    MOTresponse404MockJSON,
    MOTresponse200MockJSONwithTestFailures,
} = require("../test-responses/MOT-history-API");
jestFetchMock.enableMocks();

describe("GET /test", () => {
    test("the response code is 200", async () => {
        const response = await request(app).get("/car/test");

        expect(response.statusCode).toBe(200);
    });

    test("Returns test reportResults", async () => {
        const response = await request(app).get("/car/test");

        expect(response.body).toEqual({ message: "Car route test" });
    });
});

describe("POST / with malformed registrationNumber in request JSON", () => {
    test("the response code is 400", async () => {
        const response = await request(app)
            .post("/car")
            .send({ registrationber: "AA19AAA" });

        expect(response.statusCode).toBe(400);
    });

    test("Returns error reportResults", async () => {
        const response = await request(app)
            .post("/car")
            .send({ registrationber: "AA19AAA" });

        expect(response.body).toEqual({
            reportResults:
                "Couldn't find registrationNumber, did you send this in the request body?",
        });
    });
});

describe("POST / with valid registrationNumber in request JSON", () => {
    test("the response code is 200", async () => {
        const response = await request(app)
            .post("/car")
            .send({ registrationNumber: "AA19AAA" });

        expect(response.statusCode).toBe(200);
    });

    test("Returns warning message if no vehicleData", async () => {
        const response = await request(app)
            .post("/car")
            .send({ registrationNumber: "AA19AAA" });

        expect(response.body).toEqual({
            reportResults: "No comparisons can be made",
        });
    });

    describe("Matching vehicleData with DVLA, DVSA records", () => {
        beforeEach(() => {
            fetch.resetMocks();
            fetch.mockResponseOnce(JSON.stringify(DVLAresponse200MockJSON), {
                status: 200,
            });
            fetch.mockResponseOnce(
                JSON.stringify({
                    access_token: "mockAccessToken",
                    expires_in: 3600,
                })
            );
            fetch.mockResponseOnce(JSON.stringify(MOTresponse200MockJSON), {
                status: 200,
            });
            process.env.DVSA_TOKEN_URL = "https://mock-token-url.com";
            process.env.DVSA_CLIENT_ID = "mockClientId";
            process.env.DVSA_CLIENT_SECRET = "mockClientSecret";
            process.env.DVSA_API_KEY = "mockApiKey";
        });
        it("Returns pass reportResults for each", async () => {
            const response = await request(app)
                .post("/car")
                .send({
                    registrationNumber: "AA19AAA",
                    vehicleData: {
                        make: "ford",
                        model: "Focus",
                        colour: "Red",
                        fuelType: "Petrol",
                        registrationDate: "2019",
                        mileage: "35000",
                    },
                });

            expect(response.body).toEqual({
                reportResults: {
                    make: "Pass",
                    model: "Pass",
                    colour: "Pass",
                    fuelType: "Pass",
                    registrationDate: "Pass",
                    mileage: "Pass",
                    taxStatus: "Taxed",
                    hasOutstandingRecall: "No",
                    motData: {
                        motRequired: true,
                        motTestDueDate: "2024-03-30",
                        motFailures: [],
                    },
                },
            });
        });
    });

    describe("Different vehicleData from DVLA, DVSA records", () => {
        beforeEach(() => {
            fetch.resetMocks();
            fetch.mockResponseOnce(JSON.stringify(DVLAresponse200MockJSON), {
                status: 200,
            });
            fetch.mockResponseOnce(JSON.stringify(MOTresponse200MockJSON), {
                status: 200,
            });
            process.env.DVSA_TOKEN_URL = "https://mock-token-url.com";
            process.env.DVSA_CLIENT_ID = "mockClientId";
            process.env.DVSA_CLIENT_SECRET = "mockClientSecret";
            process.env.DVSA_API_KEY = "mockApiKey";
        });
        it("Returns Fail reportResults for each", async () => {
            const response = await request(app)
                .post("/car")
                .send({
                    registrationNumber: "AA19AAA",
                    vehicleData: {
                        make: "BMW",
                        model: "X5",
                        colour: "Black",
                        fuelType: "JetFuel",
                        registrationDate: "2055",
                        mileage: "200",
                    },
                });

            expect(response.body).toEqual({
                reportResults: {
                    make: "Fail: should be FORD",
                    model: "Fail: should be FOCUS",
                    colour: "Fail: should be RED",
                    fuelType: "Fail: should be PETROL",
                    registrationDate: "Fail: should be 2019",
                    mileage: "Fail: should be 30000 miles",
                    taxStatus: "Taxed",
                    hasOutstandingRecall: "No",
                    motData: {
                        motRequired: true,
                        motTestDueDate: "2024-03-30",
                        motFailures: [],
                    },
                },
            });
        });
    });

    describe("No vehicleData supplied", () => {
        beforeEach(() => {
            fetch.resetMocks();
            fetch.mockResponseOnce(JSON.stringify(DVLAresponse200MockJSON), {
                status: 200,
            });
            fetch.mockResponseOnce(JSON.stringify(MOTresponse200MockJSON), {
                status: 200,
            });
            process.env.DVSA_TOKEN_URL = "https://mock-token-url.com";
            process.env.DVSA_CLIENT_ID = "mockClientId";
            process.env.DVSA_CLIENT_SECRET = "mockClientSecret";
            process.env.DVSA_API_KEY = "mockApiKey";
        });
        it("Returns Fail reportResults for each", async () => {
            const response = await request(app).post("/car").send({
                registrationNumber: "AA19AAA",
                vehicleData: {},
            });

            expect(response.body).toEqual({
                reportResults: {
                    make: "No data provided. Make is FORD",
                    model: "No data provided. Model is FOCUS",
                    colour: "No data provided. Colour is RED",
                    fuelType: "No data provided. fuel type is PETROL",
                    registrationDate:
                        "No data provided. registration date is 2019",
                    mileage:
                        "No data provided. last MOT mileage was 30000 miles",
                    taxStatus: "Taxed",
                    hasOutstandingRecall: "No",
                    motData: {
                        motRequired: true,
                        motTestDueDate: "2024-03-30",
                        motFailures: [],
                    },
                },
            });
        });
    });
    describe("Car less than 3 years old, no DVLA/DVSA record of mileage", () => {
        beforeEach(() => {
            fetch.resetMocks();
            fetch.mockResponseOnce(JSON.stringify(DVLAresponse200MockJSON), {
                status: 200,
            });
            delete MOTresponse200MockJSON.motTests;
            MOTresponse200MockJSON.motTestDueDate = "2024-04-30";
            fetch.mockResponseOnce(JSON.stringify(MOTresponse200MockJSON), {
                status: 200,
            });
            process.env.DVSA_TOKEN_URL = "https://mock-token-url.com";
            process.env.DVSA_CLIENT_ID = "mockClientId";
            process.env.DVSA_CLIENT_SECRET = "mockClientSecret";
            process.env.DVSA_API_KEY = "mockApiKey";
        });
        it("Returns no MOT history reportResults for mileage", async () => {
            const response = await request(app)
                .post("/car")
                .send({
                    registrationNumber: "AA19AAA",
                    vehicleData: { mileage: "200000" },
                });

            expect(response.body.reportResults.motData).toEqual({
                motRequired: true,
                motTestDueDate: "2024-04-30",
                motFailures: [],
            });
        });
    });
    describe("Car more than 40 years old, MOT exempt", () => {
        beforeEach(() => {
            fetch.resetMocks();
            fetch.mockResponseOnce(JSON.stringify(DVLAresponse200MockJSON), {
                status: 200,
            });
            delete MOTresponse200MockJSON.motTests;
            MOTresponse200MockJSON.motTestDueDate = null;
            fetch.mockResponseOnce(JSON.stringify(MOTresponse200MockJSON), {
                status: 200,
            });
            process.env.DVSA_TOKEN_URL = "https://mock-token-url.com";
            process.env.DVSA_CLIENT_ID = "mockClientId";
            process.env.DVSA_CLIENT_SECRET = "mockClientSecret";
            process.env.DVSA_API_KEY = "mockApiKey";
        });
        it("Returns false for MOT required", async () => {
            const response = await request(app).post("/car").send({
                registrationNumber: "AA19AAA",
                vehicleData: {},
            });

            expect(response.body.reportResults.motData).toEqual({
                motRequired: false,
                motTestDueDate: null,
                motFailures: [],
            });
        });
    });
    describe("MOT failure history", () => {
        beforeEach(() => {
            fetch.resetMocks();
            fetch.mockResponseOnce(JSON.stringify(DVLAresponse200MockJSON), {
                status: 200,
            });
            fetch.mockResponseOnce(
                JSON.stringify(MOTresponse200MockJSONwithTestFailures),
                {
                    status: 200,
                }
            );
            process.env.DVSA_TOKEN_URL = "https://mock-token-url.com";
            process.env.DVSA_CLIENT_ID = "mockClientId";
            process.env.DVSA_CLIENT_SECRET = "mockClientSecret";
            process.env.DVSA_API_KEY = "mockApiKey";
        });
        it("returns all failure occasions and non advisories", async () => {
            const response = await request(app).post("/car").send({
                registrationNumber: "AA19AAA",
                vehicleData: {},
            });

            expect(response.body.reportResults.motData).toEqual({
                motRequired: true,
                motTestDueDate: "2024-11-28",
                motFailures: [
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
                                text: "Nearside Rear Tyre has a cut in excess of the requirements deep enough to reach the ply or cords (5.2.3 (d) (i))",
                                type: "PRS",
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
                        ],
                    },
                ],
            });
        });
    });
    describe("Latest MOT failed, motTestDueDate returns 'Latest MOT failed'", () => {
        beforeEach(() => {
            fetch.resetMocks();
            fetch.mockResponseOnce(JSON.stringify(DVLAresponse200MockJSON), {
                status: 200,
            });
            MOTresponse200MockJSONwithTestFailures.motTests.shift();
            fetch.mockResponseOnce(
                JSON.stringify(MOTresponse200MockJSONwithTestFailures),
                {
                    status: 200,
                }
            );
            process.env.DVSA_TOKEN_URL = "https://mock-token-url.com";
            process.env.DVSA_CLIENT_ID = "mockClientId";
            process.env.DVSA_CLIENT_SECRET = "mockClientSecret";
            process.env.DVSA_API_KEY = "mockApiKey";
        });
        it("returns all failure occasions and non advisories", async () => {
            const response = await request(app).post("/car").send({
                registrationNumber: "AA19AAA",
                vehicleData: {},
            });

            expect(response.body.reportResults.motData.motTestDueDate).toEqual(
                "Latest MOT failed"
            );
        });
    });
});

describe("POST / with non existant registrationNumber in request JSON", () => {
    beforeEach(() => {
        fetch.resetMocks();
        fetch.mockResponseOnce(JSON.stringify(DVLAresponse404MockJSON), {
            status: 404,
        });
        fetch.mockResponseOnce(JSON.stringify(MOTresponse404MockJSON), {
            status: 404,
        });
        process.env.DVSA_TOKEN_URL = "https://mock-token-url.com";
        process.env.DVSA_CLIENT_ID = "mockClientId";
        process.env.DVSA_CLIENT_SECRET = "mockClientSecret";
        process.env.DVSA_API_KEY = "mockApiKey";
    });
    it("Returns 404 and not found reportResults", async () => {
        const response = await request(app)
            .post("/car")
            .send({
                registrationNumber: "SN1FRZ",
                vehicleData: {
                    make: "Citroen",
                    model: "C15",
                    colour: "Green",
                },
            });
        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual({
            reportResults: "Record for vehicle not found",
        });
    });
});
