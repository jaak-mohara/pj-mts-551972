module.exports = {
  env: {
    es6: true,
    node: true,
  },
  parserOptions: {
    "ecmaVersion": 2018,
  },
  indent: ["error", 2],
  extends: [
    "eslint:recommended",
    "google",
  ],
  ignorePatterns: [
    ".eslintrc.js",
    "node_modules/**/*",
    "tests/**/*",
  ],
  rules: {
    "no-restricted-globals": ["error", "name", "length"],
    "prefer-arrow-callback": "error",
    "quotes": ["error", "single", { "allowTemplateLiterals": true }],
    "object-curly-spacing": ["error", "always"]
  },
  overrides: [
    {
      files: ["**/*.spec.*"],
      env: {
        mocha: true,
      },
      rules: {},
    },
  ],
  globals: {},
};
