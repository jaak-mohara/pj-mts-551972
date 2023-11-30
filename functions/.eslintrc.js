module.exports = {
  env: {
    es6: true,
    node: true,
  },
  parserOptions: {
    "ecmaVersion": 2018,
  },
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
    "indent": ["error", 2],
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
