/* eslint-disable jest/no-conditional-expect */
/* eslint-disable n/no-unsupported-features/node-builtins */
const jestFetchMock = require("jest-fetch-mock");
const googleVisionData = require("../test-responses/googleVisionAPIdata");
const getGoogleVisionText = require("../../services/googleVision");
require("dotenv").config();
jestFetchMock.enableFetchMocks();

describe("googleVisionService", () => {
    const GOOGLE_VISION_URL = process.env.GOOGLE_VISION_URL;
    const GOOGLE_VISION_API_KEY = process.env.GOOGLE_VISION_API_KEY;

    beforeEach(() => {
        fetch.resetMocks();
    });

    it("Calls google vision API with correct URL, params, headers and body", async () => {
        const testImgUrl =
            "https://i.ebayimg.com/images/g/qbgAAOSwAeVnNddn/s-l1600.webp";
        const payload = {
            requests: [
                {
                    image: {
                        source: {
                            imageUri: testImgUrl,
                        },
                    },
                    features: [
                        {
                            type: "TEXT_DETECTION",
                            maxResults: 10,
                        },
                    ],
                },
            ],
        };

        fetch.mockResponseOnce(JSON.stringify(googleVisionData), {
            status: 200,
        });
        const response = await getGoogleVisionText(testImgUrl);
        expect(fetch).toHaveBeenCalledWith(
            GOOGLE_VISION_URL,
            expect.objectContaining({
                method: "POST",
                headers: {
                    "x-goog-api-key": GOOGLE_VISION_API_KEY,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            })
        );
        expect(response).toEqual(googleVisionData);
    });
    it("Calls google vision API with invalid information", async () => {
        process.env.GOOGLE_VISION_URL = "https://example.org";
        const testImgUrl =
            "https://i.ebayimg.com/images/g/qbgAAOSwAeVnNddn/s-l1600.webp";
        const payload = {
            requests: [
                {
                    image: {
                        source: {
                            imageUri: testImgUrl,
                        },
                    },
                    features: [
                        {
                            type: "TEXT_DETECTION",
                            maxResults: 10,
                        },
                    ],
                },
            ],
        };

        fetch.mockResponseOnce(JSON.stringify(googleVisionData), {
            status: 400,
        });
        try {
            await getGoogleVisionText(testImgUrl);
        } catch (error) {
            expect(error.message).toBe(
                "Error calling GooglevisionAPI: Error: Request error, status: 400"
            );
        }
    });
});
