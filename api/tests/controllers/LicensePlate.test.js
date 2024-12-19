const request = require("supertest");
const jestFetchMock = require("jest-fetch-mock");
const googleVisionDataRaw = require("../test-responses/googleVisionAPIdata");
const complexVisionData = require("../test-responses/googleVisionAPIComplex");
const LicensePlateImage = require("../../models/licensePlateImage");

const app = require("../../app");
// const MapReview = require("../../models/mapReviews");
require("../mongodb_helper");
jestFetchMock.enableFetchMocks();

describe("/getLicensePlate", () => {
    beforeEach(async () => {
        jestFetchMock.resetMocks();
        await LicensePlateImage.deleteMany({});
    });

    afterEach(() => {
        jestFetchMock.resetMocks();
    });

    describe("GET retrieves the license plate from an image as plain text", () => {
        it("returns a status of 201 when making an external api call", async () => {
            const mockData = googleVisionDataRaw;
            jestFetchMock.mockResponseOnce(JSON.stringify(mockData));

            const imgUrl =
                "https://i.ebayimg.com/images/g/qbgAAOSwAeVnNddn/s-l1600.webp";
            const response = await request(app).get(
                `/getLicensePlate?imgUrl=${encodeURIComponent(imgUrl)}`
            );
            expect(response.statusCode).toBe(201);
        });
        it("returns a license plate when given simple data", async () => {
            const mockData = googleVisionDataRaw;
            jestFetchMock.mockResponseOnce(JSON.stringify(mockData));

            const imgUrl =
                "https://i.ebayimg.com/images/g/qbgAAOSwAeVnNddn/s-l1600.webp";

            const response = await request(app).get(
                `/getLicensePlate?imgUrl=${encodeURIComponent(imgUrl)}`
            );
            expect(response.statusCode).toBe(201);
            expect(response.body.licensePlates).toEqual("FG67 HUK");
        });
        it("returns license plates from more complex data", async () => {
            const mockData = complexVisionData;
            jestFetchMock.mockResponseOnce(JSON.stringify(mockData));

            const imgUrl =
                "https://i.ebayimg.com/images/g/qbgAAOSwAeVnNddn/s-l1600.webp";

            const response = await request(app).get(
                `/getLicensePlate?imgUrl=${encodeURIComponent(imgUrl)}`
            );
            expect(response.statusCode).toBe(201);
            expect(response.body.licensePlates).toEqual([
                "RX66 YNL",
                "WD66 HXS",
            ]);
        });
        it("doesn't return license plate when none in picture", async () => {
            const mockData = {
                responses: [
                    {
                        textAnnotations: [
                            {
                                description: "",
                            },
                        ],
                    },
                ],
            };
            jestFetchMock.mockResponseOnce(JSON.stringify(mockData));

            const imgUrl =
                "http://getwallpapers.com/wallpaper/full/8/8/5/884299-gorgerous-cute-kitten-wallpaper-2880x1800-for-4k-monitor.jpg";

            const response = await request(app).get(
                `/getLicensePlate?imgUrl=${encodeURIComponent(imgUrl)}`
            );
            expect(response.statusCode).toBe(404);
            expect(response.body.message).toBe("No number plate found.");
        });
    });

    describe("POST retrieves the most common license plate from an image", () => {
        it("returns a status of 200 when making an external api call", async () => {
            const mockData = complexVisionData;
            jestFetchMock.mockResponse(JSON.stringify(mockData));

            const imgArray = [
                "https://i.ebayimg.com/images/g/slEAAOSwDD5nYECl/s-l1600.webp",
                "https://i.ebayimg.com/images/g/EIkAAOSw2DZnYECl/s-l1600.webp",
                "https://i.ebayimg.com/images/g/Qb0AAOSw-ChnYECl/s-l1600.webp",
                "https://i.ebayimg.com/images/g/pVwAAOSwH65nYECr/s-l1600.webp",
                "https://i.ebayimg.com/images/g/RbYAAOSwrOxnYECl/s-l1600.webp",
                "https://i.ebayimg.com/images/g/e1MAAOSwpIJnYECl/s-l1600.webp",
            ];

            const response = await request(app)
                .post("/getLicensePlate")
                .send([...imgArray]);
            expect(response.statusCode).toBe(200);
        });
        it("returns a license plate when given simple data", async () => {
            const mockData = complexVisionData;
            jestFetchMock.mockResponse(JSON.stringify(mockData));

            const imgArray = [
                "https://i.ebayimg.com/images/g/slEAAOSwDD5nYECl/s-l1600.webp",
                "https://i.ebayimg.com/images/g/EIkAAOSw2DZnYECl/s-l1600.webp",
                "https://i.ebayimg.com/images/g/Qb0AAOSw-ChnYECl/s-l1600.webp",
                "https://i.ebayimg.com/images/g/pVwAAOSwH65nYECr/s-l1600.webp",
                "https://i.ebayimg.com/images/g/RbYAAOSwrOxnYECl/s-l1600.webp",
                "https://i.ebayimg.com/images/g/e1MAAOSwpIJnYECl/s-l1600.webp",
            ];

            const response = await request(app)
                .post("/getLicensePlate")
                .send([...imgArray]);
            expect(response.statusCode).toBe(200);
            expect(response.body.mostCommonPlate).toEqual("WD66 HXS");
        });
        it("returns license plates from more complex data", async () => {
            const mockData1 = complexVisionData;
            const mockData2 = {
                responses: [{}],
            };
            jestFetchMock.mockResponseOnce(JSON.stringify(mockData2));
            jestFetchMock.mockResponse(JSON.stringify(mockData1));

            const imgArray = [
                "https://i.ebayimg.com/images/g/slEAAOSwDD5nYECl/s-l1600.webp",
                "https://i.ebayimg.com/images/g/EIkAAOSw2DZnYECl/s-l1600.webp",
                "https://i.ebayimg.com/images/g/Qb0AAOSw-ChnYECl/s-l1600.webp",
                "https://i.ebayimg.com/images/g/pVwAAOSwH65nYECr/s-l1600.webp",
                "https://i.ebayimg.com/images/g/RbYAAOSwrOxnYECl/s-l1600.webp",
                "https://i.ebayimg.com/images/g/e1MAAOSwpIJnYECl/s-l1600.webp",
            ];

            const response = await request(app)
                .post("/getLicensePlate")
                .send([...imgArray]);
            expect(response.statusCode).toBe(200);
            expect(response.body.mostCommonPlate).toEqual("WD66 HXS");
        });
        it("doesn't return license plate when none in picture", async () => {
            const mockData = {
                responses: [
                    {
                        textAnnotations: [
                            {
                                description: "",
                            },
                        ],
                    },
                ],
            };
            jestFetchMock.mockResponse(JSON.stringify(mockData));

            const imgArray = [
                "https://i.ebayimg.com/images/g/slEAAOSwDD5nYECl/s-l1600.webp",
                "https://i.ebayimg.com/images/g/EIkAAOSw2DZnYECl/s-l1600.webp",
                "https://i.ebayimg.com/images/g/Qb0AAOSw-ChnYECl/s-l1600.webp",
                "https://i.ebayimg.com/images/g/pVwAAOSwH65nYECr/s-l1600.webp",
                "https://i.ebayimg.com/images/g/RbYAAOSwrOxnYECl/s-l1600.webp",
                "https://i.ebayimg.com/images/g/e1MAAOSwpIJnYECl/s-l1600.webp",
            ];

            const response = await request(app)
                .post("/getLicensePlate")
                .send([...imgArray]);
            expect(response.statusCode).toBe(200);
            expect(response.body.mostCommonPlate).toEqual(undefined);
        });
        it("doesn't return license plate when no images given", async () => {
            const mockData = {
                responses: [{}],
            };
            jestFetchMock.mockResponse(JSON.stringify(mockData));

            const imgArray = [""];

            const response = await request(app)
                .post("/getLicensePlate")
                .send([...imgArray]);
            expect(response.statusCode).toBe(200);
            expect(response.body.mostCommonPlate).toEqual(undefined);
        });
        it("returns license plate if found in database", async () => {
            const mockData = complexVisionData;
            jestFetchMock.mockResponse(JSON.stringify(mockData));

            const imgArray = [
                "https://i.ebayimg.com/images/g/slEAAOSwDD5nYECl/s-l1600.webp",
                "https://i.ebayimg.com/images/g/EIkAAOSw2DZnYECl/s-l1600.webp",
                "https://i.ebayimg.com/images/g/Qb0AAOSw-ChnYECl/s-l1600.webp",
                "https://i.ebayimg.com/images/g/pVwAAOSwH65nYECr/s-l1600.webp",
                "https://i.ebayimg.com/images/g/RbYAAOSwrOxnYECl/s-l1600.webp",
                "https://i.ebayimg.com/images/g/e1MAAOSwpIJnYECl/s-l1600.webp",
            ];
            jestFetchMock.mockResponse(JSON.stringify(mockData));

            const storedImage = new LicensePlateImage({
                imageUrl:
                    "https://i.ebayimg.com/images/g/slEAAOSwDD5nYECl/s-l1600.webp",
                licensePlatesInImage: ["WD66 HXS"],
            });
            storedImage.save();
            const response = await request(app)
                .post("/getLicensePlate")
                .send([...imgArray]);
            expect(response.statusCode).toBe(200);
            expect(response.body.mostCommonPlate).toEqual("WD66 HXS");
        });
    });
});
