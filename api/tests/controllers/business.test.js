const request = require("supertest");
const app = require("../../app");

describe("/business", () => {
    describe("GET /test", () => {
		test("the response code is 200", async () => {
			const response = await request(app)
			.get("/business/test");

			expect(response.statusCode).toBe(200);
		})

		test("Returns test message", async () => {
			const response = await request(app)
			.get("/business/test");

			expect(response.body).toEqual({message: "Business route test"});
		})
    })
})