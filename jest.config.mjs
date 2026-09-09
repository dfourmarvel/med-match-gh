import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  dir: "./"
});

const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1"
  },
  collectCoverage: true,
  collectCoverageFrom: [
    "lib/**/*.{ts,tsx}",
    "app/api/**/*.{ts,tsx}",
    "!**/*.d.ts",
    "!**/__tests__/**",
    "!**/*.test.{ts,tsx}",
    // Not a sensible unit-test target: the LLM call wrapper is all network I/O.
    "!lib/ai/**"
  ],
  coverageReporters: ["text", "lcov"],
  coverageThreshold: {
    // Regression floor, re-baselined after the dead-code deletion took the real
    // numbers to 78.4 / 62.0 / 88.7 / 79.1. Set a couple of points under each so
    // an ordinary refactor does not trip it, but a genuine regression does.
    global: {
      statements: 76,
      branches: 60,
      functions: 86,
      lines: 77
    }
  }
};

export default createJestConfig(customJestConfig);
