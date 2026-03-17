module.exports = {
  testEnvironment: "jsdom",
  testMatch: ["**/src/tests/**/*.test.[jt]s?(x)"],
  setupFilesAfterEnv: ["<rootDir>/src/tests/setupTests.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^.+\\.(css|scss|sass)$": "<rootDir>/src/tests/styleMock.js",
  },
};
