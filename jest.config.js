"use strict";

const rootDir = process.cwd();
const jestDefaultConfig = {
  rootDir,
  roots: ["<rootDir>/src"],
  coverageReporters: [
    "lcov",
    "json-summary",
    "text-summary"
  ],
  // modulePathIgnorePatterns: ["<rootDir>/coverage/","<rootDir>/src/**/*.scss"],
  collectCoverageFrom: [
    'src/**/*.js',
    'src/**/*.jsx'
    ],
  modulePaths: ["<rootDir>/node_modules", "<rootDir>/src"],
  setupFilesAfterEnv: ["<rootDir>/setupTests.js"],
  transform: {
    "^.+\\.jsx?$": "babel-jest",
    "\\.(jpg|jpeg|png|gif|styl|svg|pdf)$": "<rootDir>/config/jest/fileTransformer.js",
    "\\.(css|less|scss)$": "<rootDir>/config/jest/fileTransformer.js"
  },
  transformIgnorePatterns: [
    "<rootDir>/node_modules/(?!(react-dates|@babel)/)"
  ],
  collectCoverage: true,
  testResultsProcessor: "jest-sonar-reporter",
  coverageDirectory: "./coverage",
  testEnvironment: "jsdom"
};

module.exports = jestDefaultConfig;
