/* eslint-disable quotes */
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

    test("should handle token refresh failure", async () => {
        fetch.mockResponseOnce(
            JSON.stringify({
                error: "invalid_client",
                error_description: "Client authentication failed",
            }),
            { status: 400 }
        );

        const registration = "AV21LBE";

        await expect(getMotInfo(registration)).rejects.toThrow(
            'Internal server error: Error fetching MOT data: {"error":"invalid_client","error_description":"Client authentication failed"}'
        );

        expect(fetch).toHaveBeenCalledTimes(1);
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
