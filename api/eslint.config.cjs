// eslint.config.cjs

const js = require("@eslint/js");
const nodePlugin = require("eslint-plugin-n"); // Use 'eslint-plugin-node' if applicable
const prettierPlugin = require("eslint-plugin-prettier");
const jestPlugin = require("eslint-plugin-jest");
const promisePlugin = require("eslint-plugin-promise"); // For async/await best practices
const globals = require("globals");

module.exports = [
    // Include ESLint's recommended rules
    js.configs.recommended,

    // Base configuration for your project
    {
        files: ["**/*.js"],
        ignores: ["node_modules/**"],
        languageOptions: {
            ecmaVersion: 2021,
            sourceType: "commonjs",
            globals: {
                ...globals.node, // Include Node.js globals like 'process' and 'console'
            },
        },
        plugins: {
            n: nodePlugin, // Use 'node' if using 'eslint-plugin-node'
            prettier: prettierPlugin,
            promise: promisePlugin,
        },
        rules: {
            // Node.js plugin recommended rules
            ...nodePlugin.configs.recommended.rules,

            // Prettier plugin recommended rules
            ...prettierPlugin.configs.recommended.rules,

            // Promise plugin recommended rules
            ...promisePlugin.configs.recommended.rules,

            // Enforce Prettier formatting
            "prettier/prettier": "error",

            // Custom ESLint rules
            "indent": ["error", 4],
            "linebreak-style": ["error", "unix"],
            "quotes": ["error", "double"],
            "quote-props": ["error", "always"],
            "semi": ["error", "always"],
            "no-unused-vars": ["warn"],
            "no-console": "off",

            // Disable certain Node.js plugin rules that may conflict
            "n/no-unsupported-features/es-syntax": "off",
            "n/no-missing-import": "off",
            "n/no-unpublished-require": "off",
        },
    },

    // Jest and Supertest specific configuration
    {
        files: ["**/__tests__/**/*.js", "**/*.test.js", "**/*.spec.js"],
        plugins: {
            jest: jestPlugin,
        },
        languageOptions: {
            globals: {
                ...globals.jest, // Include Jest globals
            },
        },
        rules: {
            // Jest plugin recommended rules
            ...jestPlugin.configs.recommended.rules,

            // Additional Jest rules (optional)
            "jest/no-disabled-tests": "warn",
            "jest/no-focused-tests": "error",
            "jest/no-identical-title": "error",
            "jest/valid-expect": "error",
        },
    },
];
