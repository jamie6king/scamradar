const request = require("supertest");
const jestFetchMock = require("jest-fetch-mock");
const googleVisionDataRaw = require("../test-responses/googleVisionAPIdata");
const app = require("../../app");
// const MapReview = require("../../models/mapReviews");
require("../mongodb_helper");
jestFetchMock.enableFetchMocks();
const getGoogleVisionText = require("../../services/googleVision")

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
        it("returns filtered data for processing", async () => {
            const mockData = googleVisionDataRaw;
            jestFetchMock.mockResponseOnce(JSON.stringify(mockData));

            const imgUrl =
                "https://i.ebayimg.com/images/g/qbgAAOSwAeVnNddn/s-l1600.webp";

            const getData = await getGoogleVisionText(imgUrl);
            console.log(getData.responses);
            // const response = await request(app).get(
            //     `/getLicensePlate/${encodeURIComponent(imgUrl)}`
            // );
            // console.log(response.body);
            // expect(response.statusCode).toBe(201);
        });
    });
});
