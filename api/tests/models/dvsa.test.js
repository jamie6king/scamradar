const DvsaToken = require("../../models/dvsa");

describe("DvsaToken Model", () => {
    it("correctly saves a new accesstoken with expires_in and lastupdated", () => {
        const dvsaToken = new DvsaToken({
            _id: "123456789",
            access_token: "asdfghjkl123456789",
            expires_in: 3599,
            last_update: "2024-12-11T16:59:10.064+00:00",
        });
        expect(dvsaToken.access_token).toEqual("asdfghjkl123456789");
        expect(dvsaToken.expires_in).toEqual(3599);
        expect(dvsaToken.last_update).toEqual(new Date(dvsaToken.last_update));
    });
});
