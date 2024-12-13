/* eslint-disable n/no-unsupported-features/node-builtins */
const { getMotInfo } = require("../../services/dvsa");
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
        process.env.TOKEN_URL = "https://mock-token-url.com";
        process.env.CLIENT_ID = "mockClientId";
        process.env.CLIENT_SECRET = "mockClientSecret";
        process.env.API_KEY = "mockApiKey";
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
        // Mock failed token response
        fetch.mockResponseOnce(
            JSON.stringify({ message: "Internal Server Error" }),
            { status: 500 }
        );

        const registration = "XYZ789";

        // Assert that an error is thrown when the token fetch fails
        await expect(getMotInfo(registration)).rejects.toThrow(
            "Failed to refresh token"
        );
    });
});
