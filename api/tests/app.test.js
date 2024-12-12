const request = require("supertest");
const app = require("../app");

describe("testing app.js", () => {
    it("returns 404 on an invalid url", async () => {
        const response = await request(app).get("/invalid");

        expect(response.statusCode).toBe(404);
    });
});
