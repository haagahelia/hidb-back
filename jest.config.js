module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    roots: ["<rootDir>/src", "<rootDir>/tests"],
    testMatch: ["**/__tests__/**/*.ts", "**/?(*.)+(spec|test).ts"],
    moduleFileExtensions: ["ts", "js", "json"],
    coverageDirectory: "coverage",
    collectCoverageFrom: ["src/**/*.ts", "!src/**/*.d.ts", "!src/server.ts"],
    setupFilesAfterEnv: ["<rootDir>/tests/setup.ts"],
    testTimeout: 10000,
    globals: {
        "ts-jest": {
            tsconfig: "tsconfig.jest.json",
        },
    },
};
