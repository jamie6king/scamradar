const request = require("supertest");
const jestFetchMock = require("jest-fetch-mock");
const mockMapJSON = require("./../test-responses/map-review");
const mockMapFilteredJSON = require("../test-responses/mapReviewFiltered");
const app = require("../../app");
const MapReview = require("../../models/mapReviews");
require("../mongodb_helper");
jestFetchMock.enableFetchMocks();

describe("/mapReviews", () => {
    beforeEach(async () => {
        await MapReview.deleteMany();
    });
    afterEach(() => {
        jestFetchMock.resetMocks();
    });
    describe("GET retrieve a map review using company name and postcode", () => {
        it("returns a status of 201", async () => {
            const mockData = mockMapJSON;
            jestFetchMock.mockResponseOnce(JSON.stringify(mockData));

            const companyName = "Cargiant";
            const postcode = "NW10 6RS";
            const response = await request(app).get(
                `/mapReview/${companyName}/${postcode}`
            );
            expect(response.statusCode).toBe(201);
        });
        it("returns formatted review data when a JSON result is passed in", async () => {
            const mockData = mockMapJSON;
            jestFetchMock.mockResponseOnce(JSON.stringify(mockData));
            const companyName = "Cargiant";
            const postcode = "NW10 6RS";
            const response = await request(app).get(
                `/mapReview/${companyName}/${postcode}`
            );
            expect(response.statusCode).toBe(201);
            expect(response.body.mapReviews).toEqual(mockMapFilteredJSON);
        });
        it("returns a status of 404 when an invalid JSON result is passed in", async () => {
            jestFetchMock.mockResponseOnce(JSON.stringify({}));
            const companyName = "Cargiant";
            const postcode = "NW10 6RS";
            const response = await request(app).get(
                `/mapReview/${companyName}/${postcode}`
            );
            expect(response.statusCode).toBe(404);
            expect(response.body.message).toBe(
                "The company name and postcode did not find any valid reviews, exercise caution"
            );
        });
        it("adds the review data to the database when it is a new query", async () => {
            const mockData = mockMapJSON;
            jestFetchMock.mockResponseOnce(JSON.stringify(mockData));
            const companyName = "Cargiant";
            const postcode = "NW10 6RS";
            const response = await request(app).get(
                `/mapReview/${companyName}/${postcode}`
            );
            expect(response.statusCode).toBe(201);
            const addedMapReview = await MapReview.findOne({
                query: "Cargiant NW10 6RS",
            });
            expect(addedMapReview.query).toEqual(mockMapFilteredJSON.query);
        });
        it("retrieves the review data from the database when it is an existing query", async () => {
            const mockData = mockMapJSON;
            jestFetchMock.mockResponseOnce(JSON.stringify(mockData));
            const companyName = "Cargiant";
            const postcode = "NW10 6RS";
            const responseOne = await request(app).get(
                `/mapReview/${companyName}/${postcode}`
            );
            const responseTwo = await request(app).get(
                `/mapReview/${companyName}/${postcode}`
            );
            expect(responseOne.statusCode).toBe(201);
            expect(responseTwo.statusCode).toBe(200);
        });
    });
});
