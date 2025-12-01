// Setup file for tests
beforeAll(async () => {
    process.env.NODE_ENV = "test";
});

afterAll(async () => {
    // Cleanup after all tests
});

// Set a higher timeout for async operations in tests
jest.setTimeout(10000);
