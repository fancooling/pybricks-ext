import type { JestConfigWithTsJest } from 'ts-jest';

const jestConfig: JestConfigWithTsJest = {
  // The root of your source code, allows Jest to resolve paths correctly.
  roots: ['<rootDir>/src'],

  // A preset that is used as a base for Jest's configuration.
  preset: 'ts-jest',

  // The test environment that will be used for testing.
  testEnvironment: 'node',

  // Automatically clear mock calls and instances between every test
  clearMocks: true,

  // The directory where Jest should output its coverage files
  coverageDirectory: "coverage",

  // An array of glob patterns indicating a set of files for which coverage
  // information should be collected. This ensures the report is based on your
  // source files, not your test files.
  collectCoverageFrom: ['src/**/*.ts', '!src/**/*.test.ts'],
};

export default jestConfig;