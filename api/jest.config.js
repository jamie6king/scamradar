const dotenv = require("dotenv");
dotenv.config({ path: "./.env.test" });

/** @type {import('jest').Config} */
const config = {
    verbose: true, // Give more useful output
    maxWorkers: 1, // Make sure our tests run one after another
    collectCoverage: true,
    collectCoverageFrom: [
        "**/*.js",
        "!**/node_modules/**",
        "!**/test-responses/**",
        "!**/coverage/**",
    ],
};

module.exports = config;
