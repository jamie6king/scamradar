const CompaniesHouse = require("../../models/companiesHouse");
require("../mongodb_helper");

describe("CompaniesHouse model", () => {
    beforeEach(async () => {
        await CompaniesHouse.deleteMany({});
    });

    it("should create a CompaniesHouse instance", () => {
        const record = new CompaniesHouse({
            bussinessNumber: "12345678",
            businessInfo: {
                company_name: "Example Company Ltd",
                company_number: "12345678",
                company_status: "active",
                date_of_creation: "2000-01-01",
                registered_office_address: {
                    address_line_1: "123 Example Street",
                    postal_code: "AB1 2CD",
                    locality: "Example Town",
                    country: "United Kingdom",
                },
                accounts: {
                    next_due: "2024-12-31",
                    overdue: false,
                },
            },
        });

        expect(record.bussinessNumber).toEqual("12345678");
        expect(record.businessInfo.company_name).toEqual("Example Company Ltd");
        expect(record.businessInfo.company_status).toEqual("active");
        expect(record.businessInfo.date_of_creation).toEqual("2000-01-01");
        expect(record.businessInfo.company_number).toEqual("12345678");
    });
});
