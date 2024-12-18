/* eslint-disable n/no-unsupported-features/node-builtins */
const {
    getDvlaJson,
    findDvlaJson,
    saveDvlaJson,
} = require("../../services/car");
const jestFetchMock = require("jest-fetch-mock");
const {
    DVLAresponse200MockJSON,
    DVLAresponse404MockJSON,
} = require("../test-responses/DVLA-VES-API");
jestFetchMock.enableMocks();
require("../mongodb_helper");
const DvlaResponse = require("../../models/dvla");

// const posts = await Post.find();
//       expect(posts.length).toEqual(1);
//       expect(posts[0].message).toEqual("Hello World!!");

describe("testing getDvlaJson", () => {
    beforeEach(() => {
        fetch.resetMocks();
    });

    it("calls DVLA API with correct URL, headers and body", async () => {
        fetch.mockResponseOnce(JSON.stringify(DVLAresponse200MockJSON), {
            status: 200,
        });
        const registrationNumber = "AA19AAA";
        await getDvlaJson(registrationNumber);
        expect(fetch).toHaveBeenCalledWith(
            process.env.DVLA_URL,
            expect.objectContaining({
                method: "POST",
                headers: {
                    "x-api-key": process.env.DVLA_API_KEY,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    registrationNumber: registrationNumber,
                }),
            })
        );
    });

    it("calls DVLA API with non existing registration number and reterns data for 404 response", async () => {
        fetch.mockResponseOnce(JSON.stringify(DVLAresponse404MockJSON), {
            status: 404,
        });
        const registrationNumber = "AA19AAA";
        const response = await getDvlaJson(registrationNumber);
        expect(response).toEqual(DVLAresponse404MockJSON);
    });

    it("calls DVLA API with existing registration number and reterns data for 200 response", async () => {
        fetch.mockResponseOnce(JSON.stringify(DVLAresponse200MockJSON), {
            status: 200,
        });
        const response = await getDvlaJson("AA19AAA");
        expect(response).toEqual(DVLAresponse200MockJSON);
    });

    it("calls DVLA API without registration number, throws error", async () => {
        fetch.mockResponseOnce(JSON.stringify({ data: "400 response" }), {
            status: 400,
        });
        await expect(getDvlaJson()).rejects.toThrow(
            "Unable to fetch DVLA details"
        );
    });
});

describe("testing findDvlaJson with 200 response", () => {
    beforeEach(async () => {
        await DvlaResponse.deleteMany({});
        const dvlaEntry = new DvlaResponse({
            numberPlate: "AA19AAA",
            dvlaResponse: DVLAresponse200MockJSON,
        });
        await dvlaEntry.save();
    });
    afterEach(async () => {
        await DvlaResponse.deleteMany({});
    });

    test("findDvlaJson returns dvlaResponse", async () => {
        const dvlaResponse = await findDvlaJson("AA19AAA");
        expect(dvlaResponse).toEqual(DVLAresponse200MockJSON);
    });

    test("findDvlaJson returns none for non existing entry", async () => {
        const dvlaResponse = await findDvlaJson("SN1FRZ");
        expect(dvlaResponse).toBe(null);
    });
});

describe("testing findDvlaJson with 404 response", () => {
    beforeEach(async () => {
        await DvlaResponse.deleteMany({});
        const dvlaEntry = new DvlaResponse({
            numberPlate: "SN1FRZ",
            dvlaResponse: DVLAresponse404MockJSON,
        });
        await dvlaEntry.save();
    });
    afterEach(async () => {
        await DvlaResponse.deleteMany({});
    });

    test("findDvlaJson returns dvlaResponse", async () => {
        const dvlaResponse = await findDvlaJson("SN1FRZ");
        expect(dvlaResponse).toEqual(DVLAresponse404MockJSON);
    });
});

describe("testing saveDvlaJson", () => {
    beforeEach(async () => {
        await DvlaResponse.deleteMany({});
    });
    afterEach(async () => {
        await DvlaResponse.deleteMany({});
    });

    test("saveDvlaJson saves entry with numberPlate to db", async () => {
        await saveDvlaJson(DVLAresponse200MockJSON, "AA19AAA");
        const dvlaResponse = await DvlaResponse.findOne({
            numberPlate: "AA19AAA",
        });
        expect(dvlaResponse.numberPlate).toEqual("AA19AAA");
        expect(dvlaResponse.dvlaResponse).toEqual(DVLAresponse200MockJSON);
    });

    test("saveDvlaJson saves 404 entry with numberPlate to db", async () => {
        await saveDvlaJson(DVLAresponse404MockJSON, "AA19AAA");
        const dvlaResponse = await DvlaResponse.findOne({
            numberPlate: "AA19AAA",
        });
        expect(dvlaResponse.numberPlate).toEqual("AA19AAA");
        expect(dvlaResponse.dvlaResponse).toEqual(DVLAresponse404MockJSON);
    });
});
