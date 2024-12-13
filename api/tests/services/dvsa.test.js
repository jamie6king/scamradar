/* eslint-disable n/no-unsupported-features/node-builtins */
const getMotInfo = require("../../services/dvsa");
const jestFetchMock = require("jest-fetch-mock");
jestFetchMock.enableMocks();
beforeEach(() => {
    fetch.resetMocks();
});

afterEach(() => {
    fetch.mockReset();
});

describe("getMotInfo", () => {
    beforeAll(() => {
        process.env.DVSA_TOKEN_URL = "https://mock-token-url.com";
        process.env.DVSA_CLIENT_ID = "mockClientId";
        process.env.DVSA_CLIENT_SECRET = "mockClientSecret";
        process.env.DVSA_API_KEY = "mockApiKey";
    });

    test("should fetch MOT data for a valid reg number", async () => {
        fetch.mockResponseOnce(
            JSON.stringify({
                access_token: "mockAccessToken",
                expires_in: 3600,
            })
        );

        fetch.mockResponseOnce(
            JSON.stringify({
                registration: "ABC123",
                motHistory: [
                    {
                        testDate: "2024-01-01",
                        result: "PASS",
                    },
                ],
            })
        );

        const registration = "ABC123";
        const result = await getMotInfo(registration);

        expect(result).toEqual({
            registration: "ABC123",
            motHistory: [
                {
                    testDate: "2024-01-01",
                    result: "PASS",
                },
            ],
        });
    });

    test("should handle token expiry and refresh", async () => {
        fetch.mockResponseOnce(
            JSON.stringify({
                access_token: "mockAccessToken",
                expires_in: 3600,
            })
        );

        fetch.mockReset();

        fetch.mockResponseOnce(
            JSON.stringify({
                registration: "DEF456",
                motHistory: [
                    {
                        testDate: "2024-01-02",
                        result: "FAIL",
                    },
                ],
            })
        );

        const registration = "DEF456";
        const result = await getMotInfo(registration);

        expect(result).toEqual({
            registration: "DEF456",
            motHistory: [
                {
                    testDate: "2024-01-02",
                    result: "FAIL",
                },
            ],
        });
    });

    test("should handle token fetch errors", async () => {
        fetch.mockResponseOnce(
            JSON.stringify({ message: "Internal Server Error" }),
            { status: 500 }
        );

        const registration = "XYZ789";

        await expect(getMotInfo(registration)).rejects.toThrow(
            "Internal server error: Error fetching MOT data: {\"message\":\"Internal Server Error\"}"
        );
    });
    test("should handle MOT API fetch errors", async () => {
        fetch.mockResponseOnce(
            JSON.stringify({
                access_token: "mockAccessToken",
                expires_in: 3600,
            })
        );
        fetch.mockReset();
        fetch.mockResponseOnce(
            JSON.stringify({ message: "Vehicle not found" }),
            { status: 404 }
        );

        const registration = "*******";
        await expect(getMotInfo(registration)).rejects.toThrow(
            "Internal server error: Error fetching MOT data: {\"message\":\"Vehicle not found\"}"
        );
    });

    test("should handle token refresh failure", async () => {
        // Mock the token response to fail (first call)
        fetch.mockResponseOnce(
            JSON.stringify({
                error: "invalid_client",
                error_description: "Client authentication failed",
            }),
            { status: 400 } // Simulating token refresh failure with a 400 status
        );

        const registration = "AV21LBE";

        // Ensure that the function throws an error when token refresh fails
        await expect(getMotInfo(registration)).rejects.toThrow(
            "Internal server error: Error fetching MOT data: {\"error\":\"invalid_client\",\"error_description\":\"Client authentication failed\"}"
        );

        // Verify that fetch was called once (only for token)
        expect(fetch).toHaveBeenCalledTimes(1);
    });
});
