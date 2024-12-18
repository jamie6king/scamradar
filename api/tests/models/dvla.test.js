const {
    DVLAresponse200MockJSON,
    DVLAresponse404MockJSON,
} = require("../test-responses/DVLA-VES-API");

const DvlaResponse = require("../../models/dvla");
require("../mongodb_helper");

describe("dvlaResponse model", () => {
    beforeEach(async () => {
        await DvlaResponse.deleteMany({});
    });
    it("should create a DVLAResponse instance", () => {
        const record = new DvlaResponse({
            numberPlate: "AA19AAA",
            dvlaResponse: DVLAresponse200MockJSON,
        });
        expect(record.numberPlate).toEqual("AA19AAA");
        expect(record.dvlaResponse).toEqual(DVLAresponse200MockJSON);
    });
    it("should create a DVLAResponse instance for 404 reponse", () => {
        const record = new DvlaResponse({
            numberPlate: "SN1FRZ",
            dvlaResponse: DVLAresponse404MockJSON,
        });
        expect(record.numberPlate).toEqual("SN1FRZ");
        expect(record.dvlaResponse).toEqual(DVLAresponse404MockJSON);
    });
});
