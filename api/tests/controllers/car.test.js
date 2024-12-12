const request = require("supertest");
const jestFetchMock = require("jest-fetch-mock");
const app = require("../../app");
const {
    DVLAresponse200MockJSON,
    DVLAresponse404MockJSON,
} = require("../test-responses/DVLA-VES-API");
jestFetchMock.enableMocks();

describe("/car", () => {
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

    describe("POST / with valid registrationNumber but no advertData in request JSON", () => {
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
    });

    describe("POST / with valid registrationNumber and matching vehicleData in request JSON", () => {
        beforeEach(() => {
            fetch.resetMocks();
            fetch.mockResponseOnce(JSON.stringify(DVLAresponse200MockJSON), {
                status: 200,
            });
        });

        it("the response code is 200", async () => {
            const response = await request(app)
                .post("/car")
                .send({
                    registrationNumber: "AA19AAA",
                    vehicleData: { make: "ford", colour: "Red" },
                });

            expect(response.statusCode).toBe(200);
        });

        it("Returns pass message", async () => {
            const response = await request(app)
                .post("/car")
                .send({
                    registrationNumber: "AA19AAA",
                    vehicleData: { make: "ford", colour: "Red" },
                });

            expect(response.body).toEqual({
                message: { make: "Pass", colour: "Pass" },
            });
        });
    });
    describe("POST / with valid registrationNumber and not matching vehicleData in request JSON", () => {
        beforeEach(() => {
            fetch.resetMocks();
            fetch.mockResponseOnce(JSON.stringify(DVLAresponse200MockJSON), {
                status: 200,
            });
        });

        it("the response code is 200", async () => {
            const response = await request(app)
                .post("/car")
                .send({
                    registrationNumber: "AA19AAA",
                    vehicleData: { make: "BMW", colour: "Black" },
                });

            expect(response.statusCode).toBe(200);
        });

        it("Returns pass message", async () => {
            const response = await request(app)
                .post("/car")
                .send({
                    registrationNumber: "AA19AAA",
                    vehicleData: { make: "BMW", colour: "Black" },
                });

            expect(response.body).toEqual({
                message: {
                    make: "Fail, make should be: ford",
                    colour: "Fail, colour should be: red",
                },
            });
        });

        describe("POST / with valid registrationNumber and badly formatted vehicleData in request JSON", () => {
            beforeEach(() => {
                fetch.resetMocks();
                fetch.mockResponseOnce(
                    JSON.stringify(DVLAresponse200MockJSON),
                    {
                        status: 200,
                    }
                );
            });

            it("the response code is 200", async () => {
                const response = await request(app)
                    .post("/car")
                    .send({
                        registrationNumber: "AA19AAA",
                        vehicleData: { make: "FoRd", colour: "rEd" },
                    });

                expect(response.statusCode).toBe(200);
            });

            it("Returns pass message", async () => {
                const response = await request(app)
                    .post("/car")
                    .send({
                        registrationNumber: "AA19AAA",
                        vehicleData: { make: "FoRd", colour: "rEd" },
                    });

                expect(response.body).toEqual({
                    message: { make: "Pass", colour: "Pass" },
                });
            });
        });
    });

    describe("POST / with valid registrationNumber and vehicleData not present in DVLA data", () => {
        beforeEach(() => {
            fetch.resetMocks();
            fetch.mockResponseOnce(JSON.stringify(DVLAresponse200MockJSON), {
                status: 200,
            });
        });

        it("the response code is 200", async () => {
            const response = await request(app)
                .post("/car")
                .send({
                    registrationNumber: "AA19AAA",
                    vehicleData: { magicBeans: "5", sniffs: "Many" },
                });

            expect(response.statusCode).toBe(200);
        });

        it("Returns pass message", async () => {
            const response = await request(app)
                .post("/car")
                .send({
                    registrationNumber: "AA19AAA",
                    vehicleData: { magicBeans: "5", sniffs: "Many" },
                });

            expect(response.body).toEqual({
                message: {
                    magicBeans: "Fail, no data found",
                    sniffs: "Fail, no data found",
                },
            });
        });
    });
});
