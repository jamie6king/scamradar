/* eslint-disable n/no-unsupported-features/node-builtins */
const jestFetchMock = require("jest-fetch-mock");
const googleVisionData = require("../test-responses/googleVisionAPIdata");
const getGoogleVisionText = require("../../services/googleVision");
require("dotenv").config();
jestFetchMock.enableFetchMocks();

describe("googleVisionService", () => {
    const baseUrl = "https://vision.googleapis.com/v1/images:annotate";

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

        const expectedUrl = `${baseUrl}?key=${process.env.GOOGLE_VISION_API_KEY}`;

        fetch.mockResponseOnce(JSON.stringify(googleVisionData), {
            status: 200,
        });
        const response = await getGoogleVisionText(testImgUrl);
        expect(fetch).toHaveBeenCalledWith(
            expectedUrl,
            expect.objectContaining({
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            })
        );
        expect(response).toEqual(googleVisionData);
    });
});
