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
} = require("../test-responses/MOT-history-API");
jestFetchMock.enableMocks();

describe("GET /test", () => {
    test("the response code is 200", async () => {
        const response = await request(app).get("/car/test");

        expect(response.statusCode).toBe(200);
    });

    test("Returns test message", async () => {
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

    test("Returns error message", async () => {
        const response = await request(app)
            .post("/car")
            .send({ registrationber: "AA19AAA" });

        expect(response.body).toEqual({
            message:
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

    test("Returns message", async () => {
        const response = await request(app)
            .post("/car")
            .send({ registrationNumber: "AA19AAA" });

        expect(response.body).toEqual({
            message: "No comparisons can be made",
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
        it("Returns pass message for each", async () => {
            const response = await request(app)
                .post("/car")
                .send({
                    registrationNumber: "AA19AAA",
                    vehicleData: {
                        make: "ford",
                        model: "Focus",
                        colour: "Red",
                    },
                });

            expect(response.body).toEqual({
                message: { make: "Pass", model: "Pass", colour: "Pass" },
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
        it("Returns Fail message for each", async () => {
            const response = await request(app)
                .post("/car")
                .send({
                    registrationNumber: "AA19AAA",
                    vehicleData: {
                        make: "BMW",
                        model: "X5",
                        colour: "Black",
                    },
                });

            expect(response.body).toEqual({
                message: {
                    make: "Fail: should be FORD",
                    model: "Fail: should be FOCUS",
                    colour: "Fail: should be RED",
                },
            });
        });
    });

    describe("No vehicleData from DVLA, DVSA records", () => {
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
        it("Returns Fail message for each", async () => {
            const response = await request(app).post("/car").send({
                registrationNumber: "AA19AAA",
                vehicleData: {},
            });

            expect(response.body).toEqual({
                message: {
                    make: "No data provided. Make is FORD",
                    model: "No data provided. Model is FOCUS",
                    colour: "No data provided. Colour is RED",
                },
            });
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
    it("Returns 404 and not found message", async () => {
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
            message: "Record for vehicle not found",
        });
    });
});
