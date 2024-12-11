const request = require("supertest");
const app = require("../../app");

describe("/car", () => {
    describe("GET /test", () => {
		test("the response code is 200", async () => {
			const response = await request(app)
			.get("/car/test");

			expect(response.statusCode).toBe(200);
		})

		test("Returns test message", async () => {
			const response = await request(app)
			.get("/car/test");

			expect(response.body).toEqual({message: "Car route test"});
		})
    })
})