/* eslint-disable n/no-unsupported-features/node-builtins */
const getDvlaJson = require("../../services/car");
const jestFetchMock = require("jest-fetch-mock");
const {
    DVLAresponse200MockJSON,
    DVLAresponse404MockJSON,
} = require("../test-responses/DVLA-VES-API");
jestFetchMock.enableMocks();

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
