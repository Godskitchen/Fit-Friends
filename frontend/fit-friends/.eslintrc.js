module.exports = {
  root: true,
  ignorePatterns: ['.eslintrc.js'],
  plugins: ['@typescript-eslint'],
  overrides: [
    {
    parser: '@typescript-eslint/parser',
    parserOptions: {
      project: 'tsconfig.json',
      tsconfigRootDir: __dirname,
      sourceType: 'module',
    },
    files: ["./src/**/*.ts", "./src/**/*.tsx", "*test*"],
    extends: [
      "react-app",
      "react-app/jest",
      "htmlacademy/react-typescript"
    ],
    rules: {
      "@typescript-eslint/unbound-method": "off",
      "jest/unbound-method": "error",
      "@typescript-eslint/no-misused-promises": [2, {
        "checksVoidReturn": {
          "attributes": false
        }
      }]
    },
    }
  ]
};
