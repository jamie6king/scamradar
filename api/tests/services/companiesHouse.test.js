/* eslint-disable n/no-unsupported-features/node-builtins */
const getCompaniesHouseJson = require("../../services/companiesHouse");
const jestFetchMock = require("jest-fetch-mock");
const {
    CompaniesHouse200MockJSON,
    CompaniesHouse404MockJSON,
} = require("../test-responses/CompaniesHouse-API");

jestFetchMock.enableMocks();

describe("testing getCompaniesHouseJson", () => {
    beforeEach(() => {
        fetch.resetMocks();
    });

    it("calls Companies House API with correct URL, headers and returns 200 response", async () => {
        fetch.mockResponseOnce(JSON.stringify(CompaniesHouse200MockJSON), {
            status: 200,
        });

        const response = await getCompaniesHouseJson("12345678");

        expect(response).toEqual(CompaniesHouse200MockJSON);
    });

    it("calls Companies House API with non-existing company number and returns 404 response", async () => {
        fetch.mockResponseOnce(JSON.stringify(CompaniesHouse404MockJSON), {
            status: 404,
        });

        const companyNumber = "99999999";
        const response = await getCompaniesHouseJson(companyNumber);

        expect(response).toEqual(CompaniesHouse404MockJSON);
    });

    it("calls Companies House API without company number, throws error", async () => {
        fetch.mockResponseOnce(
            JSON.stringify({
                errors: [{ status: "400", description: "Bad Request" }],
            }),
            {
                status: 400,
            }
        );

        await expect(getCompaniesHouseJson()).rejects.toThrow(
            "unable to connect to Companies House"
        );
    });
});
