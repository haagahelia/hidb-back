import request from "supertest";
import app from "../../src/app";
import organizationService from "../../src/services/OrganizationService";
import {
    createRealWorldOrganizations,
    createMultipleMockOrganizations,
    createMockOrganization,
    expectSuccessResponse,
    expectErrorResponse,
    isValidOrganizationType,
} from "../utils/testHelpers";

// Mock OrganizationService
jest.mock("../../src/services/OrganizationService");

describe("Organization Routes", () => {
    const mockOrganizations = [
        createRealWorldOrganizations.nasa(),
        createRealWorldOrganizations.boeing(),
        createRealWorldOrganizations.airbus(),
        createMockOrganization({id: 4, name: "Finnair", type: "airline", country: "Finland", founding_year: 1923}),
        createMockOrganization({
            id: 5,
            name: "Finnish Air Force",
            type: "military",
            country: "Finland",
            founding_year: 1918,
        }),
    ];

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("GET /api/organizations", () => {
        it("should return all organizations with status 200", async () => {
            (organizationService.getAllOrganizations as jest.Mock).mockResolvedValue(mockOrganizations);

            const response = await request(app).get("/api/organizations").expect("Content-Type", /json/).expect(200);

            expectSuccessResponse(response, 200);
            expect(response.body.message).toBe("Organizations retrieved successfully");
            expect(response.body.data).toEqual(mockOrganizations);
            expect(response.body.count).toBe(5);
        });

        it("should return empty array when no organizations exist", async () => {
            (organizationService.getAllOrganizations as jest.Mock).mockResolvedValue([]);

            const response = await request(app).get("/api/organizations").expect(200);

            expectSuccessResponse(response, 200);
            expect(response.body.data).toEqual([]);
            expect(response.body.count).toBe(0);
        });

        it("should handle database errors gracefully", async () => {
            (organizationService.getAllOrganizations as jest.Mock).mockRejectedValue(
                new Error("Database connection failed")
            );

            const response = await request(app).get("/api/organizations").expect(500);

            expectErrorResponse(response, 500, "Error retrieving organizations from database");
        });

        it("should return multiple organizations using helper", async () => {
            const manyOrgs = createMultipleMockOrganizations(15);
            (organizationService.getAllOrganizations as jest.Mock).mockResolvedValue(manyOrgs);

            const response = await request(app).get("/api/organizations");

            expectSuccessResponse(response);
            expect(response.body.count).toBe(15);
            expect(response.body.data.length).toBe(15);
        });
    });

    describe("GET /api/organizations/:id", () => {
        it("should return specific organization by ID", async () => {
            const boeing = createRealWorldOrganizations.boeing();
            (organizationService.getOrganizationById as jest.Mock).mockResolvedValue(boeing);

            const response = await request(app).get("/api/organizations/2").expect("Content-Type", /json/).expect(200);

            expectSuccessResponse(response, 200);
            expect(response.body.message).toBe("Organization retrieved successfully");
            expect(response.body.data).toEqual(boeing);
            expect(response.body.data.name).toBe("Boeing");
        });

        it("should return 404 when organization not found", async () => {
            (organizationService.getOrganizationById as jest.Mock).mockResolvedValue(null);

            const response = await request(app).get("/api/organizations/999").expect(404);

            expectErrorResponse(response, 404, "Organization not found");
        });

        it("should return 400 for invalid ID format", async () => {
            const response = await request(app).get("/api/organizations/invalid").expect(400);

            expectErrorResponse(response, 400, "Invalid organization ID");
        });

        it("should handle database errors for specific organization", async () => {
            (organizationService.getOrganizationById as jest.Mock).mockRejectedValue(
                new Error("Database query failed")
            );

            const response = await request(app).get("/api/organizations/1").expect(500);

            expectErrorResponse(response, 500, "Error retrieving organization from database");
        });
    });

    describe("Organization Response Structure", () => {
        it("should return organization with all required fields", async () => {
            const nasa = createRealWorldOrganizations.nasa();
            (organizationService.getOrganizationById as jest.Mock).mockResolvedValue(nasa);

            const response = await request(app).get("/api/organizations/1");

            expect(response.body.data).toHaveProperty("id");
            expect(response.body.data).toHaveProperty("name");
            expect(response.body.data).toHaveProperty("type");
            expect(response.body.data).toHaveProperty("country");
        });

        it("should handle optional fields correctly", async () => {
            const nasa = createRealWorldOrganizations.nasa();
            (organizationService.getOrganizationById as jest.Mock).mockResolvedValue(nasa);

            const response = await request(app).get("/api/organizations/1");

            expect(response.body.data).toHaveProperty("founding_year");
            expect(response.body.data).toHaveProperty("logo_url");
            expect(response.body.data.logo_url).toBeNull();
        });

        it("should have valid ENUM values for type field", async () => {
            (organizationService.getAllOrganizations as jest.Mock).mockResolvedValue(mockOrganizations);

            const response = await request(app).get("/api/organizations");

            response.body.data.forEach((org: any) => {
                expect(isValidOrganizationType(org.type)).toBe(true);
            });
        });

        it("should validate all organization types using helper", async () => {
            const allTypes = createMultipleMockOrganizations(6);
            (organizationService.getAllOrganizations as jest.Mock).mockResolvedValue(allTypes);

            const response = await request(app).get("/api/organizations");

            const types = [...new Set(response.body.data.map((o: any) => o.type))];
            types.forEach((type) => {
                expect(isValidOrganizationType(type as string)).toBe(true);
            });
        });
    });

    describe("Organization Types", () => {
        it("should correctly identify airline organizations", async () => {
            const finnair = createMockOrganization({
                id: 4,
                name: "Finnair",
                type: "airline",
                country: "Finland",
            });
            (organizationService.getOrganizationById as jest.Mock).mockResolvedValue(finnair);

            const response = await request(app).get("/api/organizations/4");

            expectSuccessResponse(response);
            expect(response.body.data.type).toBe("airline");
            expect(response.body.data.name).toBe("Finnair");
        });

        it("should correctly identify military organizations", async () => {
            const military = createMockOrganization({
                id: 5,
                name: "Finnish Air Force",
                type: "military",
                country: "Finland",
            });
            (organizationService.getOrganizationById as jest.Mock).mockResolvedValue(military);

            const response = await request(app).get("/api/organizations/5");

            expectSuccessResponse(response);
            expect(response.body.data.type).toBe("military");
        });

        it("should correctly identify commercial organizations", async () => {
            (organizationService.getAllOrganizations as jest.Mock).mockResolvedValue(mockOrganizations);

            const response = await request(app).get("/api/organizations");

            const commercialOrgs = response.body.data.filter((org: any) => org.type === "commercial");
            expect(commercialOrgs.length).toBeGreaterThan(0);
            expect(commercialOrgs.some((org: any) => org.name === "Boeing")).toBe(true);
            expect(commercialOrgs.some((org: any) => org.name === "Airbus")).toBe(true);
        });
    });

    describe("Multiple Organizations Test", () => {
        it("should return correct count of organizations", async () => {
            (organizationService.getAllOrganizations as jest.Mock).mockResolvedValue(mockOrganizations);

            const response = await request(app).get("/api/organizations");

            expectSuccessResponse(response);
            expect(response.body.count).toBe(mockOrganizations.length);
            expect(Array.isArray(response.body.data)).toBe(true);
        });

        it("should return organizations from different countries", async () => {
            (organizationService.getAllOrganizations as jest.Mock).mockResolvedValue(mockOrganizations);

            const response = await request(app).get("/api/organizations");

            const countries = [...new Set(response.body.data.map((org: any) => org.country))];
            expect(countries.length).toBeGreaterThan(1);
            expect(countries).toContain("USA");
            expect(countries).toContain("France");
            expect(countries).toContain("Finland");
        });

        it("should handle large number of organizations", async () => {
            const manyOrgs = createMultipleMockOrganizations(50);
            (organizationService.getAllOrganizations as jest.Mock).mockResolvedValue(manyOrgs);

            const response = await request(app).get("/api/organizations");

            expectSuccessResponse(response);
            expect(response.body.count).toBe(50);
        });
    });
});
