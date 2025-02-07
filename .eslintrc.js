module.exports = {
    env: {
        browser: true,
        es6: true,
        node: true,
    },
    extends: [
        "eslint:recommended",
        "plugin:import/recommended",
        "plugin:react/recommended",
        "plugin:@typescript-eslint/recommended", // Add support for TypeScript
    ],
    plugins: ["react", "react-hooks", "@typescript-eslint"],
    parser: "@babel/eslint-parser",
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        sourceType: "module",
        requireConfigFile: false,
    },
    settings: {
        react: {
            version: "detect",
        },
        "import/resolver": {
            node: {
                extensions: [".js", ".jsx", ".ts", ".tsx"], // Add .ts and .tsx extensions
                moduleDirectory: ["node_modules", "src/"],
            },
        },
    },
    rules: {
        // Add additional rules here as needed
        "no-unused-vars": "warn",
        "react/react-in-jsx-scope": "off",
        "@typescript-eslint/no-unused-vars": "warn", // Use TypeScript-specific rule
    },
};