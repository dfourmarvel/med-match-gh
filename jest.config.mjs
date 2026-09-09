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
    // Regression floor at current real coverage of the logic surface (lib + api
    // routes, with the LLM/prompt/deprecated/seed-only modules excluded above).
    global: {
      statements: 65,
      branches: 55,
      functions: 72,
      lines: 65
    }
  }
};

export default createJestConfig(customJestConfig);
