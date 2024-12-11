const DvlaResponse = require("../../models/dvla");

describe("dvlaResponse model", () => {
    it("should create a DVLAResponse instance", async () => {
        const record = new DvlaResponse({
            productId: "TEST123",
            response: {
                registrationNumber: "AB12CDE",
                taxStatus: "TAXED",
                taxDueDate: "2025-06-09",
                motStatus: "Valid",
                make: "AUDI",
                yearOfManufacture: 2014,
                engineCapacity: 1969,
                co2Emissions: 109,
                fuelType: "DIESEL",
                markedForExport: false,
                colour: "GREEN",
                typeApproval: "M1",
                revenueWeight: 1870,
                dateOfLastV5CIssued: "2024-06-27",
                motExpiryDate: "2025-07-08",
                wheelplan: "2 AXLE RIGID BODY",
                monthOfFirstRegistration: "2013-12",
            },
        });
        expect(record.productId).toEqual("TEST123");
        expect(record.response.registrationNumber).toEqual("AB12CDE");
        expect(record.response.make).toEqual("AUDI");
        expect(record.response.fuelType).toEqual("DIESEL");
        expect(record.response.make).toEqual("AUDI");
        expect(record.response.monthOfFirstRegistration).toEqual("2013-12");
    });
});
