import request from "supertest";
import app from "../../src/app";
import db from "../../src/config/database";

describe("Aircraft Integration Tests (with real database)", () => {
    // Only run integration tests if RUN_INTEGRATION_TESTS flag is set and database connection
    const shouldRunIntegrationTests = process.env.RUN_INTEGRATION_TESTS === "true";

    beforeAll(async () => {
        if (shouldRunIntegrationTests) {
            // Check database connection
            try {
                await db.raw("SELECT 1");
            } catch (error) {
                console.log("Database not available, skipping integration tests");
            }
        }
    });

    afterAll(async () => {
        if (shouldRunIntegrationTests) {
            await db.destroy();
        }
    });

    // Skip tests if missing flag RUN_INTEGRATION_TESTS
    (shouldRunIntegrationTests ? describe : describe.skip)("Real Database Tests", () => {
        it("should fetch aircraft from real database", async () => {
            const response = await request(app).get("/api/aircraft").expect(200);

            expect(response.body.success).toBe(true);
            expect(Array.isArray(response.body.data)).toBe(true);

            if (response.body.data.length > 0) {
                const firstAircraft = response.body.data[0];
                expect(firstAircraft).toHaveProperty("id");
                expect(firstAircraft).toHaveProperty("name");
                expect(firstAircraft).toHaveProperty("manufacturer");
            }
        });

        it("should fetch specific aircraft by ID from real database", async () => {
            // Get list of aircraft first to obtain a valid ID
            const listResponse = await request(app).get("/api/aircraft");

            if (listResponse.body.data.length > 0) {
                const firstAircraftId = listResponse.body.data[0].id;

                const response = await request(app).get(`/api/aircraft/${firstAircraftId}`).expect(200);

                expect(response.body.success).toBe(true);
                expect(response.body.data.id).toBe(firstAircraftId);
            }
        });

        it("should return 404 for non-existent aircraft ID", async () => {
            const response = await request(app).get("/api/aircraft/999999").expect(404);

            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe("Aircraft not found");
        });
    });
});
