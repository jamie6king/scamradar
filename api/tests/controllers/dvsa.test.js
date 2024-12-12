const DvsaController = require("../../controllers/dvsa");
const jestFetchMock = require("jest-fetch-mock");
jestFetchMock.enableMocks();

describe("DvsaController", () => {
    beforeEach(() => {
        global.cachedToken = null;
        global.tokenExpiryTime = null;
        jest.resetModules();
        fetch.resetMocks();
        jest.clearAllMocks();
    });
    afterEach(() => {
        global.cachedToken = null;
        global.tokenExpiryTime = null;
        fetch.resetMocks();
        jest.clearAllMocks();
    });

    it("should get a valid token", async () => {
        fetch.mockResponseOnce(
            JSON.stringify({
                access_token: "first_test_token",
                expires_in: 3600,
            }),
            { status: 200 }
        );

        const token = await DvsaController.getValidToken();
        // console.log(token);
        expect(token).toBe("first_test_token");
        console.log(fetch.mock.calls);
    });
    it.only("should handle expired token and refresh it", async () => {
        jest.resetModules();
        global.cachedToken = "old_token";
        global.tokenExpiryTime = Date.now() - 1000;
        console.log(global.tokenExpiryTime);

        fetch.mockResponseOnce(
            JSON.stringify({
                access_token: "refreshed_token",
                expires_in: 3600,
            }),
            { status: 200 }
        );

        const token = await DvsaController.getValidToken();
        console.log("refreshed token", token);
        expect(token).toBe("refreshed_token");
        expect(fetch).toHaveBeenCalledTimes(1);
    });
});
