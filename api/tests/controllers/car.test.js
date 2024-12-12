const request = require("supertest");
const app = require("../../app");

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
    describe("POST / with valid registrationNumber in request JSON", () => {
        test("the response code is 400", async () => {
            const response = await request(app)
                .post("/car")
                .send({ registrationNumber: "AA19AAA" });

            expect(response.statusCode).toBe(200);
        });

        test("Returns error message", async () => {
            const response = await request(app)
                .post("/car")
                .send({ registrationNumber: "AA19AAA" });

            expect(response.body).toEqual({
                message: "Great success!!!!",
            });
        });
    });
});
