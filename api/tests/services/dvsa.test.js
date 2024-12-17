/* eslint-disable jest/no-conditional-expect */
/* eslint-disable n/no-unsupported-features/node-builtins */
const getMotInfo = require("../../services/dvsa");

global.fetch = jest.fn();

describe("getMotInfo", () => {
    beforeEach(() => {
        global.fetch = jest.fn();
    });
    it("should handle error when fetching token", async () => {
        fetch.mockRejectedValueOnce(new Error("Token fetch failed"));

        try {
            await getMotInfo("AV21LBE");
        } catch (error) {
            expect(error.message).toBe(
                "Error refreshing the token: Token fetch failed"
            );
        }
    });
});

describe("MOT fetch fail", () => {
    beforeEach(() => {
        global.fetch = jest.fn();

        fetch.mockResolvedValueOnce({
            json: jest.fn().mockResolvedValue({
                access_token: "dummyToken",
                expires_in: 3600,
            }),
        });
    });

    it("should handle error when fetching MOT data", async () => {
        const motResponse = {
            ok: false,
            text: jest.fn().mockResolvedValue("MOT fetch failed"),
        };
        fetch.mockResolvedValueOnce(motResponse);

        try {
            await getMotInfo("AV21LBE");
        } catch (error) {
            expect(error.message).toBe(
                "Internal server error: Error fetching MOT data: MOT fetch failed"
            );
        }
        expect(fetch).toHaveBeenCalledTimes(2);
    });
});
