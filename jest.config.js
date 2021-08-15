"use strict";

// Please refer to : https://jestjs.io/docs/configuration for different configurations
const rootDir = process.cwd();
const jestDefaultConfig = {
  rootDir,
  roots: ["<rootDir>/src","<rootDir>/test/client","<rootDir>/test/server/plugins"],
  coverageReporters: [
    "lcov",
    "json-summary",
    "text-summary",
    "text"
  ],
  modulePaths: ["<rootDir>/node_modules", "<rootDir>/src"],
  setupFilesAfterEnv: ["<rootDir>/setUpTests.js"],
  transform: {
    "^.+\\.jsx?$": "babel-jest",
    "\\.(jpg|jpeg|png|gif|styl|svg|pdf)$": "<rootDir>/config/jest/fileTransformer.js",
    "\\.(css|less|scss)$": "<rootDir>/config/jest/fileTransformer.js"
  },
  transformIgnorePatterns: [
    "<rootDir>/node_modules/(?!(react-dates|@babel|@jest|enzyme)/)"
  ],
  // testPathIgnorePatterns -- to ignore files in coverage
  collectCoverage: true,
  testResultsProcessor: "jest-sonar-reporter",
  coverageDirectory: "./coverage",
  testEnvironment: "jsdom"
};

module.exports = jestDefaultConfig;
