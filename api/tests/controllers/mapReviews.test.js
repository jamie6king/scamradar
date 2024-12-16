const request = require("supertest");
const jestFetchMock = require("jest-fetch-mock");
const mockMapJSON = require("./../test-responses/map-review");
const mockMapFilteredJSON = require("../test-responses/mapReviewFiltered");
const app = require("../../app");
const MapReview = require("../../models/mapReviews");
jestFetchMock.enableFetchMocks();

describe("/mapReviews", () => {
    beforeAll(async () => {
        await MapReview.deleteMany;
    });
    afterEach(() => {
        jestFetchMock.resetMocks();
    });
    describe("GET retrieve a map review using company name and postcode", () => {
        it("returns a status of 200", async () => {
            const mockData = mockMapJSON;
            jestFetchMock.mockResponseOnce(JSON.stringify(mockData));

            const companyName = "Cargiant";
            const postcode = "NW10 6RS";
            const response = await request(app).get(
                `/mapReview/${companyName}/${postcode}`
            );
            expect(response.statusCode).toBe(200);
        });
        it("returns formatted review data when a JSON result is passed in", async () => {
            const mockData = mockMapJSON;
            jestFetchMock.mockResponseOnce(JSON.stringify(mockData));
            const companyName = "Cargiant";
            const postcode = "NW10 6RS";
            const response = await request(app).get(
                `/mapReview/${companyName}/${postcode}`
            );
            expect(response.statusCode).toBe(200);
            expect(response.body.mapReviews).toEqual(mockMapFilteredJSON);
        });
    });
});
