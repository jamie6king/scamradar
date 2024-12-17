/* eslint-disable quotes */
/* eslint-disable n/no-unsupported-features/node-builtins */
const mockRequire = require("mock-require");
const getMotInfo = require("../../services/dvsa");
const modulePath = require("../../services/dvsa");
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

    test("should handle MOT fetch errors", async () => {
        fetch.mockResponseOnce(
            JSON.stringify({ message: "Internal Server Error" }),
            { status: 500 }
        );

        const registration = "XYZ789";

        await expect(getMotInfo(registration)).rejects.toThrow(
            'Internal server error: Error fetching MOT data: {"message":"Internal Server Error"}'
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
            'Internal server error: Error fetching MOT data: {"message":"Vehicle not found"}'
        );
    });
});

describe("getMotInfo failed token refresh", () => {
    beforeEach(() => {
        fetch.resetMocks();
    });

    test("throws error when token refresh fails", async () => {
        fetch.mockReject(new Error("Network Error"));
        const registration = "AV21LBE";
        await expect(getMotInfo(registration)).rejects.toThrow(
            "Internal server error: Network Error"
        );
    });
});

describe("DVSA token refresh", () => {
    test("should handle token fetch errors", async () => {
        // Mock the fetch function to simulate a failure during the token fetch
        const errorMessage = "Simulated token refresh failure";
        global.fetch = jest.fn().mockRejectedValueOnce(new Error(errorMessage));

        // Mock the internal state variables (cachedToken and tokenExpiryTime)
        mockRequire(modulePath, {
            cachedToken: null, // Simulate no token
            tokenExpiryTime: null, // Simulate token expiration
        });

        // Import the mocked module
        const getMotInfo = mockRequire(modulePath);

        const registration = "XYZ789";

        // Test that the error is thrown correctly with the expected error message
        await expect(getMotInfo(registration)).rejects.toThrow(
            `Error refreshing the token, ${errorMessage}`
        );
    });
});
