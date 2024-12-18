/* eslint-disable jest/no-conditional-expect */
/* eslint-disable n/no-unsupported-features/node-builtins */

const {
    getMotInfo,
    findDvsaJson,
    saveDvsaJson,
} = require("../../services/dvsa");
const jestFetchMock = require("jest-fetch-mock");
jestFetchMock.enableMocks();
const {
    MOTresponse200MockJSON,
    MOTresponse404MockJSON,
} = require("../test-responses/MOT-history-API");
const DvsaResponse = require("../../models/dvsa");
require("../mongodb_helper");

beforeEach(() => {
    fetch.resetMocks();
});


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

describe("testing findDvsaJson with 200 response", () => {
    beforeEach(async () => {
        const dvsaEntry = new DvsaResponse({
            numberPlate: "AA19AAA",
            dvsaResponse: MOTresponse200MockJSON,
        });
        await dvsaEntry.save();
    });
    afterEach(async () => {
        await DvsaResponse.deleteMany({});
    });

    test("findDvsaJson returns dvlaResponse", async () => {
        const dvsaResponse = await findDvsaJson("AA19AAA");
        expect(dvsaResponse).toEqual(MOTresponse200MockJSON);
    });

    test("findDvsaJson returns none for non existing entry", async () => {
        const dvsaResponse = await findDvsaJson("SN1FRZ");
        expect(dvsaResponse).toBe(null);
    });
});

describe("testing findDvsaJson with 404 response", () => {
    beforeEach(async () => {
        const dvsaEntry = new DvsaResponse({
            numberPlate: "SN1FRZ",
            dvsaResponse: MOTresponse404MockJSON,
        });
        await dvsaEntry.save();
    });
    afterEach(async () => {
        await DvsaResponse.deleteMany({});
    });

    test("findDvsaJson returns dvsaResponse", async () => {
        const dvsaResponse = await findDvsaJson("SN1FRZ");
        expect(dvsaResponse).toEqual(MOTresponse404MockJSON);
    });
});

describe("testing saveDvlaJson", () => {
    beforeEach(async () => {
        await DvsaResponse.deleteMany({});
    });
    afterEach(async () => {
        await DvsaResponse.deleteMany({});
    });

    test("saveDvlaJson saves entry with numberPlate to db", async () => {
        await saveDvsaJson(MOTresponse200MockJSON, "AA19AAA");
        const dvsaResponse = await DvsaResponse.findOne({
            numberPlate: "AA19AAA",
        });
        expect(dvsaResponse.numberPlate).toEqual("AA19AAA");
        expect(dvsaResponse.dvsaResponse).toEqual(MOTresponse200MockJSON);
    });

    test("saveDvlaJson saves 404 entry with numberPlate to db", async () => {
        await saveDvsaJson(MOTresponse404MockJSON, "AA19AAA");
        const dvsaResponse = await DvsaResponse.findOne({
            numberPlate: "AA19AAA",
        });
        expect(dvsaResponse.numberPlate).toEqual("AA19AAA");
        expect(dvsaResponse.dvsaResponse).toEqual(MOTresponse404MockJSON);
    });
});
