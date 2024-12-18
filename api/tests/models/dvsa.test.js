const {
    MOTresponse200MockJSON,
    MOTresponse404MockJSON,
} = require("../test-responses/MOT-history-API");

const DvsaResponse = require("../../models/dvsa");
require("../mongodb_helper");

describe("dvsaResponse model", () => {
    beforeEach(async () => {
        await DvsaResponse.deleteMany({});
    });
    it("should create a DVLAResponse instance", () => {
        const record = new DvsaResponse({
            numberPlate: "AA19AAA",
            dvsaResponse: MOTresponse200MockJSON,
        });
        expect(record.numberPlate).toEqual("AA19AAA");
        expect(record.dvsaResponse).toEqual(MOTresponse200MockJSON);
    });
    it("should create a DVLAResponse instance for 404 reponse", () => {
        const record = new DvsaResponse({
            numberPlate: "SN1FRZ",
            dvsaResponse: MOTresponse404MockJSON,
        });
        expect(record.numberPlate).toEqual("SN1FRZ");
        expect(record.dvsaResponse).toEqual(MOTresponse404MockJSON);
    });
});
