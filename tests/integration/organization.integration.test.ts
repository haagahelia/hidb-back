import request from "supertest";
import app from "../../src/app";
import db from "../../src/config/database";

describe("Organization Integration Tests (with real database)", () => {
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
        describe("GET /api/organizations", () => {
            it("should fetch organizations from real database", async () => {
                const response = await request(app).get("/api/organizations").expect(200);

                expect(response.body.success).toBe(true);
                expect(Array.isArray(response.body.data)).toBe(true);
                expect(response.body.count).toBeGreaterThanOrEqual(0);

                if (response.body.data.length > 0) {
                    const firstOrg = response.body.data[0];
                    expect(firstOrg).toHaveProperty("id");
                    expect(firstOrg).toHaveProperty("name");
                    expect(firstOrg).toHaveProperty("type");
                    expect(firstOrg).toHaveProperty("country");
                }
            });

            it("should return organizations with valid ENUM types", async () => {
                const response = await request(app).get("/api/organizations");

                const validTypes = ["airline", "military", "border_guard", "postal_service", "commercial", "other"];

                response.body.data.forEach((org: any) => {
                    expect(validTypes).toContain(org.type);
                });
            });

            it("should return organizations ordered by id", async () => {
                const response = await request(app).get("/api/organizations");

                if (response.body.data.length > 1) {
                    for (let i = 1; i < response.body.data.length; i++) {
                        expect(response.body.data[i].id).toBeGreaterThan(response.body.data[i - 1].id);
                    }
                }
            });
        });

        describe("GET /api/organizations/:id", () => {
            it("should fetch specific organization by ID from real database", async () => {
                // Get list of organizations first to obtain a valid ID
                const listResponse = await request(app).get("/api/organizations");

                if (listResponse.body.data.length > 0) {
                    const firstOrgId = listResponse.body.data[0].id;

                    const response = await request(app).get(`/api/organizations/${firstOrgId}`).expect(200);

                    expect(response.body.success).toBe(true);
                    expect(response.body.data.id).toBe(firstOrgId);
                    expect(response.body.data).toHaveProperty("name");
                    expect(response.body.data).toHaveProperty("type");
                    expect(response.body.data).toHaveProperty("country");
                }
            });

            it("should return 404 for non-existent organization ID", async () => {
                const response = await request(app).get("/api/organizations/999999").expect(404);

                expect(response.body.success).toBe(false);
                expect(response.body.message).toBe("Organization not found");
            });

            it("should return 400 for invalid organization ID format", async () => {
                const response = await request(app).get("/api/organizations/invalid-id").expect(400);

                expect(response.body.success).toBe(false);
                expect(response.body.message).toBe("Invalid organization ID");
            });
        });

        describe("Organization Data Integrity", () => {
            it("should have all required fields populated", async () => {
                const response = await request(app).get("/api/organizations");

                response.body.data.forEach((org: any) => {
                    // Required fields
                    expect(org.id).toBeDefined();
                    expect(typeof org.id).toBe("number");
                    expect(org.name).toBeDefined();
                    expect(typeof org.name).toBe("string");
                    expect(org.type).toBeDefined();
                    expect(typeof org.type).toBe("string");
                    expect(org.country).toBeDefined();
                    expect(typeof org.country).toBe("string");
                });
            });

            it("should handle optional fields correctly", async () => {
                const response = await request(app).get("/api/organizations");

                response.body.data.forEach((org: any) => {
                    // Optional fields can be null or have values
                    if (org.founding_year !== null) {
                        expect(typeof org.founding_year).toBe("number");
                    }

                    if (org.logo_url !== null) {
                        expect(typeof org.logo_url).toBe("string");
                    }
                });
            });
        });

        describe("Organization Types", () => {
            it('should find NASA as "other" type', async () => {
                const response = await request(app).get("/api/organizations");

                const nasa = response.body.data.find((org: any) => org.name === "NASA");
                if (nasa) {
                    expect(nasa.type).toBe("other");
                    expect(nasa.country).toBe("USA");
                    expect(nasa.founding_year).toBe(1958);
                }
            });

            it('should find Boeing as "commercial" type', async () => {
                const response = await request(app).get("/api/organizations");

                const boeing = response.body.data.find((org: any) => org.name === "Boeing");
                if (boeing) {
                    expect(boeing.type).toBe("commercial");
                    expect(boeing.country).toBe("USA");
                    expect(boeing.founding_year).toBe(1916);
                }
            });

            it('should find Airbus as "commercial" type', async () => {
                const response = await request(app).get("/api/organizations");

                const airbus = response.body.data.find((org: any) => org.name === "Airbus");
                if (airbus) {
                    expect(airbus.type).toBe("commercial");
                    expect(airbus.country).toBe("France");
                    expect(airbus.founding_year).toBe(1970);
                }
            });

            it("should group organizations by type correctly", async () => {
                const response = await request(app).get("/api/organizations");

                const orgsByType = response.body.data.reduce((acc: any, org: any) => {
                    acc[org.type] = (acc[org.type] || 0) + 1;
                    return acc;
                }, {});

                // Should have at least commercial and other types from seed data
                expect(orgsByType).toHaveProperty("commercial");
                expect(orgsByType).toHaveProperty("other");
            });
        });

        describe("Organization Relationships", () => {
            it("should verify organizations exist for aircraft references", async () => {
                // Get all aircraft
                const aircraftResponse = await request(app).get("/api/aircraft");

                // Get all organizations
                const orgsResponse = await request(app).get("/api/organizations");

                const orgIds = orgsResponse.body.data.map((org: any) => org.id);

                // Check that all aircraft organization_ids exist in organizations
                aircraftResponse.body.data.forEach((aircraft: any) => {
                    if (aircraft.organization_id !== null) {
                        expect(orgIds).toContain(aircraft.organization_id);
                    }
                });
            });
        });

        describe("Organization Count", () => {
            it("should return count matching array length", async () => {
                const response = await request(app).get("/api/organizations");

                expect(response.body.count).toBe(response.body.data.length);
            });

            it("should have at least 3 organizations from seed data", async () => {
                const response = await request(app).get("/api/organizations");

                // Based on seed data: NASA, Boeing, Airbus
                expect(response.body.count).toBeGreaterThanOrEqual(3);
            });
        });

        describe("Error Handling", () => {
            it("should handle negative ID gracefully", async () => {
                const response = await request(app).get("/api/organizations/-1").expect(404);

                expect(response.body.success).toBe(false);
            });

            it("should handle zero ID gracefully", async () => {
                const response = await request(app).get("/api/organizations/0").expect(404);

                expect(response.body.success).toBe(false);
            });

            it("should handle very large ID numbers", async () => {
                const response = await request(app).get("/api/organizations/999999999");

                expect(response.body.success).toBe(false);
            });
        });

        describe("Response Format", () => {
            it("should return consistent JSON structure for list", async () => {
                const response = await request(app).get("/api/organizations");

                expect(response.body).toHaveProperty("success");
                expect(response.body).toHaveProperty("message");
                expect(response.body).toHaveProperty("data");
                expect(response.body).toHaveProperty("count");
                expect(response.headers["content-type"]).toMatch(/json/);
            });

            it("should return consistent JSON structure for single item", async () => {
                const listResponse = await request(app).get("/api/organizations");

                if (listResponse.body.data.length > 0) {
                    const firstOrgId = listResponse.body.data[0].id;
                    const response = await request(app).get(`/api/organizations/${firstOrgId}`);

                    expect(response.body).toHaveProperty("success");
                    expect(response.body).toHaveProperty("message");
                    expect(response.body).toHaveProperty("data");
                    expect(response.body).not.toHaveProperty("count");
                    expect(response.headers["content-type"]).toMatch(/json/);
                }
            });
        });
    });
});
