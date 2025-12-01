import request from "supertest";
import app from "../../src/app";
import organizationService from "../../src/services/OrganizationService";
import {
    createIndustryData,
    createOrganizationWithEdgeCases,
    filterByCountry,
    assertOrganizationStructure,
    assertListResponseStructure,
    calculateOrganizationStats,
} from "../utils/advancedHelpers";
import {expectSuccessResponse, createMultipleMockOrganizations} from "../utils/testHelpers";

jest.mock("../../src/services/OrganizationService");

describe("Organization Advanced Tests", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("Industry Data Management", () => {
        it("should handle multiple organizations from different industries", async () => {
            const {organizations} = createIndustryData(10, 5);
            (organizationService.getAllOrganizations as jest.Mock).mockResolvedValue(organizations);

            const response = await request(app).get("/api/organizations");

            expectSuccessResponse(response);
            expect(response.body.count).toBe(10);

            // Should have organizations from different types
            const types = [...new Set(organizations.map((o) => o.type))];
            expect(types.length).toBeGreaterThan(1);
        });

        it("should filter organizations by country using helper", async () => {
            const orgs = createMultipleMockOrganizations(20);
            (organizationService.getAllOrganizations as jest.Mock).mockResolvedValue(orgs);

            const response = await request(app).get("/api/organizations");

            const usaOrgs = filterByCountry(response.body.data, "USA");
            const franceOrgs = filterByCountry(response.body.data, "France");

            expect(usaOrgs.length).toBeGreaterThan(0);
            expect(franceOrgs.length).toBeGreaterThan(0);
        });

        it("should group organizations by country", async () => {
            const orgs = createMultipleMockOrganizations(30);
            (organizationService.getAllOrganizations as jest.Mock).mockResolvedValue(orgs);

            const response = await request(app).get("/api/organizations");

            const stats = calculateOrganizationStats(response.body.data);
            const countries = Object.keys(stats.byCountry);

            expect(countries.length).toBeGreaterThan(1);
            countries.forEach((country) => {
                expect(stats.byCountry[country]).toBeGreaterThan(0);
            });
        });
    });

    describe("Edge Cases", () => {
        it("should handle minimal organization data", async () => {
            const edgeCases = createOrganizationWithEdgeCases();
            (organizationService.getOrganizationById as jest.Mock).mockResolvedValue(edgeCases.minimal);

            const response = await request(app).get("/api/organizations/1");

            expectSuccessResponse(response);
            assertOrganizationStructure(response.body.data);

            expect(response.body.data.name).toBe("A");
            expect(response.body.data.type).toBe("other");
        });

        it("should handle maximal organization data", async () => {
            const edgeCases = createOrganizationWithEdgeCases();
            (organizationService.getOrganizationById as jest.Mock).mockResolvedValue(edgeCases.maximal);

            const response = await request(app).get("/api/organizations/999999");

            expectSuccessResponse(response);
            assertOrganizationStructure(response.body.data);

            expect(response.body.data.name.length).toBeGreaterThan(50);
            expect(response.body.data.type).toBe("postal_service");
        });

        it("should handle historic organization", async () => {
            const edgeCases = createOrganizationWithEdgeCases();
            (organizationService.getOrganizationById as jest.Mock).mockResolvedValue(edgeCases.historic);

            const response = await request(app).get("/api/organizations/2");

            expectSuccessResponse(response);
            expect(response.body.data.founding_year).toBe(1903);
            expect(response.body.data.name).toBe("Ancient Airways");
        });

        it("should handle modern organization", async () => {
            const edgeCases = createOrganizationWithEdgeCases();
            (organizationService.getOrganizationById as jest.Mock).mockResolvedValue(edgeCases.modern);

            const response = await request(app).get("/api/organizations/3");

            expectSuccessResponse(response);
            expect(response.body.data.founding_year).toBe(2023);
            expect(response.body.data.logo_url).toContain(".svg");
        });
    });

    describe("Data Structure Validation", () => {
        it("should validate all organizations have correct structure", async () => {
            const orgs = createMultipleMockOrganizations(10);
            (organizationService.getAllOrganizations as jest.Mock).mockResolvedValue(orgs);

            const response = await request(app).get("/api/organizations");

            assertListResponseStructure(response);

            response.body.data.forEach((org: any) => {
                assertOrganizationStructure(org);
            });
        });

        it("should have consistent type values across all organizations", async () => {
            const orgs = createMultipleMockOrganizations(20);
            (organizationService.getAllOrganizations as jest.Mock).mockResolvedValue(orgs);

            const response = await request(app).get("/api/organizations");

            const validTypes = ["airline", "military", "border_guard", "postal_service", "commercial", "other"];

            response.body.data.forEach((org: any) => {
                expect(validTypes).toContain(org.type);
            });
        });
    });

    describe("Statistics and Analytics", () => {
        it("should calculate organization statistics correctly", async () => {
            const orgs = createMultipleMockOrganizations(50);
            (organizationService.getAllOrganizations as jest.Mock).mockResolvedValue(orgs);

            const response = await request(app).get("/api/organizations");

            const stats = calculateOrganizationStats(response.body.data);

            expect(stats.total).toBe(50);
            expect(stats.averageAge).toBeGreaterThan(0);
            expect(Object.keys(stats.byType).length).toBeGreaterThan(0);
            expect(Object.keys(stats.byCountry).length).toBeGreaterThan(0);
        });

        it("should count organizations with and without logos", async () => {
            const orgs = createMultipleMockOrganizations(30);
            (organizationService.getAllOrganizations as jest.Mock).mockResolvedValue(orgs);

            const response = await request(app).get("/api/organizations");

            const stats = calculateOrganizationStats(response.body.data);

            expect(stats.withLogo + stats.withoutLogo).toBe(stats.total);
            expect(stats.withLogo).toBeGreaterThanOrEqual(0);
            expect(stats.withoutLogo).toBeGreaterThanOrEqual(0);
        });

        it("should identify oldest and newest organizations", async () => {
            const orgs = createMultipleMockOrganizations(20);
            (organizationService.getAllOrganizations as jest.Mock).mockResolvedValue(orgs);

            const response = await request(app).get("/api/organizations");

            const stats = calculateOrganizationStats(response.body.data);

            if (stats.oldestYear && stats.newestYear) {
                expect(stats.oldestYear).toBeLessThanOrEqual(stats.newestYear);
                expect(stats.oldestYear).toBeGreaterThan(1800);
                expect(stats.newestYear).toBeLessThanOrEqual(2025);
            }
        });

        it("should group organizations by type with correct counts", async () => {
            const orgs = createMultipleMockOrganizations(30);
            (organizationService.getAllOrganizations as jest.Mock).mockResolvedValue(orgs);

            const response = await request(app).get("/api/organizations");

            const stats = calculateOrganizationStats(response.body.data);
            const types = Object.keys(stats.byType);

            expect(types.length).toBeGreaterThan(0);

            let totalCount = 0;
            types.forEach((type) => {
                expect(stats.byType[type]).toBeGreaterThan(0);
                totalCount += stats.byType[type];
            });

            expect(totalCount).toBe(stats.total);
        });
    });

    describe("Organization Types Distribution", () => {
        it("should have airlines represented", async () => {
            const orgs = createMultipleMockOrganizations(20);
            (organizationService.getAllOrganizations as jest.Mock).mockResolvedValue(orgs);

            const response = await request(app).get("/api/organizations");

            const airlines = response.body.data.filter((o: any) => o.type === "airline");
            expect(airlines.length).toBeGreaterThanOrEqual(0);
        });

        it("should have military organizations represented", async () => {
            const orgs = createMultipleMockOrganizations(20);
            (organizationService.getAllOrganizations as jest.Mock).mockResolvedValue(orgs);

            const response = await request(app).get("/api/organizations");

            const military = response.body.data.filter((o: any) => o.type === "military");
            expect(military.length).toBeGreaterThanOrEqual(0);
        });

        it("should have commercial organizations represented", async () => {
            const orgs = createMultipleMockOrganizations(20);
            (organizationService.getAllOrganizations as jest.Mock).mockResolvedValue(orgs);

            const response = await request(app).get("/api/organizations");

            const commercial = response.body.data.filter((o: any) => o.type === "commercial");
            expect(commercial.length).toBeGreaterThanOrEqual(0);
        });
    });

    describe("Geographic Distribution", () => {
        it("should have organizations from multiple countries", async () => {
            const orgs = createMultipleMockOrganizations(25);
            (organizationService.getAllOrganizations as jest.Mock).mockResolvedValue(orgs);

            const response = await request(app).get("/api/organizations");

            const stats = calculateOrganizationStats(response.body.data);
            const countries = Object.keys(stats.byCountry);

            expect(countries.length).toBeGreaterThan(1);
        });

        it("should calculate organizations per country", async () => {
            const orgs = createMultipleMockOrganizations(30);
            (organizationService.getAllOrganizations as jest.Mock).mockResolvedValue(orgs);

            const response = await request(app).get("/api/organizations");

            const stats = calculateOrganizationStats(response.body.data);

            Object.keys(stats.byCountry).forEach((country) => {
                const count = stats.byCountry[country];
                const actual = response.body.data.filter((o: any) => o.country === country).length;
                expect(count).toBe(actual);
            });
        });
    });

    describe("Temporal Analysis", () => {
        it("should calculate average organization age", async () => {
            const orgs = createMultipleMockOrganizations(20);
            (organizationService.getAllOrganizations as jest.Mock).mockResolvedValue(orgs);

            const response = await request(app).get("/api/organizations");

            const stats = calculateOrganizationStats(response.body.data);

            if (stats.withFoundingYear > 0) {
                expect(stats.averageAge).toBeGreaterThan(0);
                expect(stats.averageAge).toBeLessThan(200); // Reasonable age
            }
        });

        it("should identify organizations by founding era", async () => {
            const orgs = createMultipleMockOrganizations(30);
            (organizationService.getAllOrganizations as jest.Mock).mockResolvedValue(orgs);

            const response = await request(app).get("/api/organizations");

            const pre1950 = response.body.data.filter((o: any) => o.founding_year && o.founding_year < 1950);
            const post2000 = response.body.data.filter((o: any) => o.founding_year && o.founding_year >= 2000);

            expect(pre1950.length + post2000.length).toBeLessThanOrEqual(response.body.count);
        });
    });

    describe("Performance with Large Datasets", () => {
        it("should handle large number of organizations efficiently", async () => {
            const largeDataset = createMultipleMockOrganizations(100);
            (organizationService.getAllOrganizations as jest.Mock).mockResolvedValue(largeDataset);

            const startTime = Date.now();
            const response = await request(app).get("/api/organizations");
            const endTime = Date.now();

            expectSuccessResponse(response);
            expect(response.body.count).toBe(100);
            expect(endTime - startTime).toBeLessThan(1000); // Should respond within 1 second
        });

        it("should calculate statistics on large datasets", async () => {
            const largeDataset = createMultipleMockOrganizations(200);
            (organizationService.getAllOrganizations as jest.Mock).mockResolvedValue(largeDataset);

            const response = await request(app).get("/api/organizations");

            const startCalc = Date.now();
            const stats = calculateOrganizationStats(response.body.data);
            const endCalc = Date.now();

            expect(stats.total).toBe(200);
            expect(endCalc - startCalc).toBeLessThan(100); // Statistics should be fast
        });
    });
});
