const request = require("supertest");
const jestFetchMock = require("jest-fetch-mock");
const googleVisionDataRaw = require("../test-responses/googleVisionAPIdata");
const complexVisionData = require("../test-responses/googleVisionAPIComplex")

const app = require("../../app");
// const MapReview = require("../../models/mapReviews");
require("../mongodb_helper");
jestFetchMock.enableFetchMocks();

describe("/getLicensePlate", () => {
    afterEach(() => {
        jestFetchMock.resetMocks();
    });
    describe("GET retrieve the license plat from an image as plain text", () => {
        it("returns a status of 201 when making an external api call", async () => {
            const mockData = googleVisionDataRaw;
            jestFetchMock.mockResponseOnce(JSON.stringify(mockData));

            const imgUrl =
                "https://i.ebayimg.com/images/g/qbgAAOSwAeVnNddn/s-l1600.webp";
            const response = await request(app).get(
                `/getLicensePlate/${encodeURIComponent(imgUrl)}`
            );
            expect(response.statusCode).toBe(201);
        });
        it("returns a license plate when given simple data", async () => {
            const mockData = googleVisionDataRaw;
            jestFetchMock.mockResponseOnce(JSON.stringify(mockData));

            const imgUrl =
                "https://i.ebayimg.com/images/g/qbgAAOSwAeVnNddn/s-l1600.webp";

            const response = await request(app).get(
                `/getLicensePlate/${encodeURIComponent(imgUrl)}`
            );
            console.log(response.body);
            expect(response.statusCode).toBe(201);
            expect(response.body.licensePlate).toEqual("FG67 HUK");
        });
        it("returns license plates from more complex data", async () => {
            const mockData = complexVisionData;
            jestFetchMock.mockResponseOnce(JSON.stringify(mockData));

            const imgUrl =
                "https://i.ebayimg.com/images/g/qbgAAOSwAeVnNddn/s-l1600.webp";

            const response = await request(app).get(
                `/getLicensePlate/${encodeURIComponent(imgUrl)}`
            );
            console.log("responseBODY: ", response.body);
        });
    });
});
