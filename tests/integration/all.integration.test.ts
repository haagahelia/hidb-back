import request from "supertest";
import app from "../../src/app";
import db from "../../src/config/database";

describe("Complete Integration Tests Suite", () => {
    const shouldRunIntegrationTests = process.env.RUN_INTEGRATION_TESTS === "true";

    beforeAll(async () => {
        if (shouldRunIntegrationTests) {
            try {
                await db.raw("SELECT 1");
                console.log("✓ Database connection established");
            } catch (error) {
                console.log("✗ Database not available, skipping integration tests");
            }
        }
    });

    afterAll(async () => {
        if (shouldRunIntegrationTests) {
            await db.destroy();
            console.log("✓ Database connection closed");
        }
    });

    (shouldRunIntegrationTests ? describe : describe.skip)("Cross-Entity Tests", () => {
        describe("Aircraft-Organization Relationships", () => {
            it("should verify all aircraft have valid organization references", async () => {
                const aircraftResponse = await request(app).get("/api/aircraft");
                const orgsResponse = await request(app).get("/api/organizations");

                const orgIds = orgsResponse.body.data.map((org: any) => org.id);

                aircraftResponse.body.data.forEach((aircraft: any) => {
                    if (aircraft.organization_id !== null) {
                        expect(orgIds).toContain(aircraft.organization_id);
                    }
                });
            });

            it("should match aircraft organization_id with actual organization", async () => {
                const aircraftResponse = await request(app).get("/api/aircraft");

                for (const aircraft of aircraftResponse.body.data) {
                    if (aircraft.organization_id !== null) {
                        const orgResponse = await request(app)
                            .get(`/api/organizations/${aircraft.organization_id}`)
                            .expect(200);

                        expect(orgResponse.body.success).toBe(true);
                        expect(orgResponse.body.data.id).toBe(aircraft.organization_id);
                    }
                }
            });
        });

        describe("Data Consistency", () => {
            it("should have consistent data counts", async () => {
                const aircraftResponse = await request(app).get("/api/aircraft");
                const orgsResponse = await request(app).get("/api/organizations");

                expect(aircraftResponse.body.count).toBe(aircraftResponse.body.data.length);
                expect(orgsResponse.body.count).toBe(orgsResponse.body.data.length);
            });

            it("should return same data on multiple requests", async () => {
                const response1 = await request(app).get("/api/organizations");
                const response2 = await request(app).get("/api/organizations");

                expect(response1.body.data).toEqual(response2.body.data);
                expect(response1.body.count).toBe(response2.body.count);
            });
        });

        describe("Seed Data Verification", () => {
            it("should have all seed organizations present", async () => {
                const response = await request(app).get("/api/organizations");

                const orgNames = response.body.data.map((org: any) => org.name);

                expect(orgNames).toContain("NASA");
                expect(orgNames).toContain("Boeing");
                expect(orgNames).toContain("Airbus");
            });

            it("should have all seed aircraft present", async () => {
                const response = await request(app).get("/api/aircraft");

                const aircraftNames = response.body.data.map((aircraft: any) => aircraft.name);

                expect(aircraftNames).toContain("A320");
                expect(aircraftNames).toContain("B737");
                expect(aircraftNames).toContain("CRJ900");
            });

            it("should match seed data details for A320", async () => {
                const response = await request(app).get("/api/aircraft");
                const a320 = response.body.data.find((a: any) => a.name === "A320");

                if (a320) {
                    expect(a320.manufacturer).toBe("Airbus");
                    expect(a320.model).toBe("A320-200");
                    expect(a320.year_built).toBe(1998);
                    expect(parseFloat(a320.weight)).toBe(73500.0);
                    expect(a320.type).toBe("commercial");
                    expect(a320.status).toBe("on display");
                }
            });

            it("should match seed data details for Boeing", async () => {
                const response = await request(app).get("/api/organizations");
                const boeing = response.body.data.find((o: any) => o.name === "Boeing");

                if (boeing) {
                    expect(boeing.type).toBe("commercial");
                    expect(boeing.country).toBe("USA");
                    expect(boeing.founding_year).toBe(1916);
                }
            });
        });

        describe("Performance Tests", () => {
            it("should respond to aircraft list request within reasonable time", async () => {
                const startTime = Date.now();
                await request(app).get("/api/aircraft").expect(200);
                const endTime = Date.now();

                const responseTime = endTime - startTime;
                expect(responseTime).toBeLessThan(1000); // Less than 1 second
            });

            it("should respond to organizations list request within reasonable time", async () => {
                const startTime = Date.now();
                await request(app).get("/api/organizations").expect(200);
                const endTime = Date.now();

                const responseTime = endTime - startTime;
                expect(responseTime).toBeLessThan(1000); // Less than 1 second
            });

            it("should handle multiple concurrent requests", async () => {
                const requests = [
                    request(app).get("/api/aircraft"),
                    request(app).get("/api/organizations"),
                    request(app).get("/api/aircraft/1"),
                    request(app).get("/api/organizations/1"),
                ];

                const responses = await Promise.all(requests);

                responses.forEach((response) => {
                    expect([200, 404]).toContain(response.status);
                });
            });
        });

        describe("Database State", () => {
            it("should maintain data integrity after multiple reads", async () => {
                const initialResponse = await request(app).get("/api/aircraft");
                const initialCount = initialResponse.body.count;

                // Perform multiple reads
                for (let i = 0; i < 5; i++) {
                    await request(app).get("/api/aircraft");
                }

                const finalResponse = await request(app).get("/api/aircraft");
                expect(finalResponse.body.count).toBe(initialCount);
            });

            it("should have proper foreign key relationships", async () => {
                const aircraftResponse = await request(app).get("/api/aircraft");

                for (const aircraft of aircraftResponse.body.data) {
                    if (aircraft.organization_id !== null) {
                        // Should be able to fetch the referenced organization
                        const orgResponse = await request(app).get(`/api/organizations/${aircraft.organization_id}`);

                        expect(orgResponse.status).toBe(200);
                    }
                }
            });
        });

        describe("API Consistency", () => {
            it("should have consistent response structure across endpoints", async () => {
                const aircraftList = await request(app).get("/api/aircraft");
                const orgsList = await request(app).get("/api/organizations");

                // Both should have same structure
                expect(aircraftList.body).toHaveProperty("success");
                expect(aircraftList.body).toHaveProperty("message");
                expect(aircraftList.body).toHaveProperty("data");
                expect(aircraftList.body).toHaveProperty("count");

                expect(orgsList.body).toHaveProperty("success");
                expect(orgsList.body).toHaveProperty("message");
                expect(orgsList.body).toHaveProperty("data");
                expect(orgsList.body).toHaveProperty("count");
            });

            it("should return arrays for list endpoints", async () => {
                const responses = await Promise.all([
                    request(app).get("/api/aircraft"),
                    request(app).get("/api/organizations"),
                ]);

                responses.forEach((response) => {
                    expect(Array.isArray(response.body.data)).toBe(true);
                });
            });
        });
    });
});
