/* eslint-disable n/no-unsupported-features/node-builtins */
const jestFetchMock = require("jest-fetch-mock");
const mockMapJSON = require("./../test-responses/map-review");
const getMapReviewJSON = require("../../services/mapReview");
require("dotenv").config();
jestFetchMock.enableFetchMocks();

describe("mapReviewService", () => {
    beforeEach(() => {
        fetch.resetMocks();
    });

    it("Calls SerpAPI with correct URL and parameters", async () => {
        fetch.mockResponseOnce(JSON.stringify(mockMapJSON), {
            status: 200,
        });

        const query = "Cargiant";
        const params = new URLSearchParams({
            engine: "google_maps",
            q: query,
            api_key: process.env.SERPAPI_API_KEY,
        });
        await getMapReviewJSON(query);
        expect(fetch).toHaveBeenCalledWith(
            `https://serpapi.com/search?${params.toString()}`
        );
    });
    it("Correctly returns map review json when called with a query", async () => {
        fetch.mockResponseOnce(JSON.stringify(mockMapJSON), {
            status: 200,
        });
        const query = "Cargiant";
        const response = await getMapReviewJSON(query);
        expect(response).toEqual(mockMapJSON);
    });
    it("Correctly handles errors from SerpAPI", async () => {
        const logSpy = jest.spyOn(console, "log");

        fetch.mockReject(new Error("Test error"));

        const query = "Cargiant";
        await getMapReviewJSON(query);

        expect(logSpy).toHaveBeenCalledWith("\nTest error\n");
    });
});
