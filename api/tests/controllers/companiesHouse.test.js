/* eslint-disable n/no-unsupported-features/node-builtins */
const request = require("supertest");
const jestFetchMock = require("jest-fetch-mock");
const app = require("../../app");
const {
    CompaniesHouse200MockJSON,
    CompaniesHouse404MockJSON,
} = require("../test-responses/CompaniesHouse-API");

jestFetchMock.enableMocks();

describe("/", () => {
    beforeEach(() => {
        fetch.resetMocks();
    });

    it("valid response using company number", async () => {
        fetch.mockResponseOnce(JSON.stringify(CompaniesHouse200MockJSON), {
            status: 200,
        });
        const companyNumber = "12345678";
        const response = await request(app)
            .post("/companiesHouse")
            .send({ companyNumber: companyNumber });
        expect(response.status).toBe(200);
    });

    it("returns 400 if company number is missing", async () => {
        const response = await request(app).post("/companiesHouse").send({});
        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            reportResults: "Couldn't find companyNumber?",
        });
    });

    it("returns 404 if route is wrong", async () => {
        fetch.mockResponseOnce(JSON.stringify(CompaniesHouse404MockJSON), {
            status: 404,
        });
        const companyNumber = "99999999";
        const response = await request(app)
            .post("/companiesHouse3")
            .send({ companyNumber: companyNumber });
        expect(response.status).toBe(404);
        expect(response.body).toEqual({
            err: "Error 404: Not Found",
        });
    });
});
