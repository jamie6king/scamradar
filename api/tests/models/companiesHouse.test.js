const CompaniesHouse = require("../../models/companiesHouse");
require("../mongodb_helper");

describe("CompaniesHouse model", () => {
    beforeEach(async () => {
        await CompaniesHouse.deleteMany({});
    });

    it("should create a CompaniesHouse instance", () => {
        const record = new CompaniesHouse({
            accounts: {
                accounting_reference_date: {
                    day: "31",
                    month: "12",
                },
                last_accounts: {
                    made_up_to: "2023-12-31",
                    period_end_on: "2023-12-31",
                    period_start_on: "2023-01-01",
                    type: "total-exemption-full",
                },
                next_accounts: {
                    due_on: "2025-09-30",
                    overdue: false,
                    period_end_on: "2024-12-31",
                    period_start_on: "2024-01-01",
                },
                next_due: "2025-09-30",
                next_made_up_to: "2024-12-31",
                overdue: false,
            },
            can_file: true,
            company_name: "Example Company Ltd",
            company_number: "12345678",
            company_status: "active",
            confirmation_statement: {
                last_made_up_to: "2024-02-21",
                next_due: "2025-03-07",
                next_made_up_to: "2025-02-21",
                overdue: false,
            },
            date_of_creation: "2000-01-01",
            etag: "mock-etag",
            has_been_liquidated: false,
            has_charges: false,
            has_insolvency_history: false,
            jurisdiction: "england-wales",
            last_full_members_list_date: "2016-02-21",
            links: {
                persons_with_significant_control:
                    "/company/12345678/persons-with-significant-control",
                self: "/company/12345678",
                charges: "/company/12345678/charges",
                filing_history: "/company/12345678/filing-history",
                officers: "/company/12345678/officers",
            },
            registered_office_address: {
                address_line_1: "Mock House",
                address_line_2: "Mock Place",
                country: "United Kingdom",
                locality: "Mock City",
                postal_code: "AB12 3CD",
                region: "Mock Region",
            },
            registered_office_is_in_dispute: false,
            sic_codes: ["45200"],
            type: "ltd",
            undeliverable_registered_office_address: false,
            has_super_secure_pscs: false,
        });

        expect(record.company_number).toEqual("12345678");
        expect(record.company_name).toEqual("Example Company Ltd");
        expect(record.company_status).toEqual("active");
        expect(record.date_of_creation).toEqual("2000-01-01");
        expect(record.registered_office_address.country).toEqual(
            "United Kingdom"
        );
    });
});
