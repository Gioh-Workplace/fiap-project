export default {
    testEnvironment: "node",
    setupFilesAfterEnv: ["<rootDir>/src/tests/setupTests.js"],
    collectCoverage: true,
    coverageThreshold: {
      global: {
        branches: 20,
        functions: 20,
        lines: 20,
        statements: 20,
      },
    },
  };
  