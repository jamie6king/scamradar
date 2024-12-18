const CompaniesHouse200MockJSON = {
    company_name: "Example Company Ltd",
    company_number: "12345678",
    company_status: "active",
    confirmation_statement: {
        last_made_up_to: "2024-10-24",
        next_due: "2025-11-07",
        next_made_up_to: "2025-10-24",
        overdue: false,
    },
    date_of_creation: "2014-10-24",
    has_charges: false,
    has_been_liquidated: false,
};

const CompaniesHouse404MockJSON = {
    errors: [
        {
            status: "404",
            description: "Not Found",
            errorMessage: "Resource not found",
        },
    ],
};

module.exports = {
    CompaniesHouse200MockJSON,
    CompaniesHouse404MockJSON,
};
