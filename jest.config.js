const nextJest = require("next/jest");

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
    // Not sensible unit-test targets: LLM call wrapper + prompt strings,
    // the deprecated scoring adapter, and the seed-only parallel scorer.
    "!lib/ai/**",
    "!lib/ai-prompts.ts",
    "!lib/scoring-engine.ts",
    "!lib/scoring/**"
  ],
  coverageReporters: ["text", "lcov"],
  coverageThreshold: {
    // Regression floor at current real coverage of the logic surface (lib + api
    // routes). Raise these as the DB-backed API routes (save-result,
    // quiz-results, results/[id]) get their own tests with Supabase mocked.
    global: {
      statements: 48,
      branches: 38,
      functions: 60,
      lines: 48
    }
  }
};

module.exports = createJestConfig(customJestConfig);
