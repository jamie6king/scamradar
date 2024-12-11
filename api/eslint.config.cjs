// eslint.config.cjs

const js = require("@eslint/js");
const nodePlugin = require("eslint-plugin-n");
const prettierPlugin = require("eslint-plugin-prettier");
const globals = require("globals"); // Import the globals package

module.exports = [
    // Include ESLint's recommended rules
    js.configs.recommended,
    {
        files: ["**/*.js"],
        ignores: ["node_modules/**"],
        languageOptions: {
            ecmaVersion: 2021,
            sourceType: "commonjs",
            globals: {
                ...globals.node, // Include Node.js globals
            },
        },
        plugins: {
            n: nodePlugin,
            prettier: prettierPlugin,
        },
        rules: {
            // Node Plugin Recommended Rules
            ...nodePlugin.configs.recommended.rules,

            // Prettier Plugin Recommended Rules
            ...prettierPlugin.configs.recommended.rules,

            // Custom Rules
            "prettier/prettier": "error",
            indent: ["error", 4],
            "linebreak-style": ["error", "unix"],
            quotes: ["error", "double"],
            semi: ["error", "always"],
            "no-unused-vars": ["warn"],
            "no-console": "off",
            "n/no-unsupported-features/es-syntax": "off",
            "n/no-missing-import": "off",
        },
    },
];
