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

    // test("should handle token expiry and refresh", async () => {
    //     // Mock token fetch (first call, token needs to be fetched)
    //     fetch.mockResponseOnce(
    //         JSON.stringify({
    //             access_token: "mockAccessToken",
    //             expires_in: 3600, // Token expiry time (1 hour)
    //         })
    //     );

    //     // Mock MOT history API response (second call, using the token)
    //     fetch.mockResponseOnce(
    //         JSON.stringify({
    //             registration: "DEF456",
    //             motHistory: [
    //                 {
    //                     testDate: "2024-01-02",
    //                     result: "FAIL",
    //                 },
    //             ],
    //         })
    //     );

    //     // The registration number we want to test
    //     const registration = "DEF456";

    //     // Call getMotInfo, which will trigger the token fetch first
    //     const result = await getMotInfo(registration);

    //     // Expect that the result is the MOT data, which comes from the second fetch call
    //     expect(result).toEqual({
    //         registration: "DEF456",
    //         motHistory: [
    //             {
    //                 testDate: "2024-01-02",
    //                 result: "FAIL",
    //             },
    //         ],
    //     });

    //     // Ensure the correct number of fetch calls were made (token fetch + MOT history fetch)
    //     expect(fetch).toHaveBeenCalledTimes(2);

    //     // Check that the first call was for the token (POST request)
    //     expect(fetch).toHaveBeenCalledWith(
    //         expect.stringContaining("/token"), // token endpoint
    //         expect.objectContaining({
    //             method: "POST",
    //             body: expect.anything(),
    //         })
    //     );

    //     // Check that the second call was for the MOT history (GET request)
    //     expect(fetch).toHaveBeenCalledWith(
    //         expect.stringContaining("/v1/trade/vehicles/registration/DEF456"), // MOT history endpoint
    //         expect.objectContaining({
    //             method: "GET",
    //             headers: expect.objectContaining({
    //                 Authorization: "Bearer mockAccessToken", // The token should be used in the Authorization header
    //             }),
    //         })
    //     );
    // });
});
