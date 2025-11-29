import request from "supertest";
import app from "../../src/app";
import aircraftService from "../../src/services/AircraftService";
import organizationService from "../../src/services/OrganizationService";
import {
    createIndustryData,
    analyzeAircraftOrganizationRelationships,
    validateDataQuality,
    calculateAircraftStats,
    calculateOrganizationStats,
} from "../utils/advancedHelpers";
import {expectSuccessResponse} from "../utils/testHelpers";

jest.mock("../../src/services/AircraftService");
jest.mock("../../src/services/OrganizationService");

describe("Combined Aircraft-Organization Advanced Tests", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("Industry-wide Data Management", () => {
        it("should handle complete industry data with relationships", async () => {
            const {organizations, aircraft} = createIndustryData(5, 10);

            (organizationService.getAllOrganizations as jest.Mock).mockResolvedValue(organizations);
            (aircraftService.getAllAircraft as jest.Mock).mockResolvedValue(aircraft);

            const [orgsResponse, aircraftResponse] = await Promise.all([
                request(app).get("/api/organizations"),
                request(app).get("/api/aircraft"),
            ]);

            expectSuccessResponse(orgsResponse);
            expectSuccessResponse(aircraftResponse);

            expect(orgsResponse.body.count).toBe(5);
            expect(aircraftResponse.body.count).toBe(50); // 5 orgs × 10 aircraft
        });

        it("should analyze relationships between aircraft and organizations", async () => {
            const {organizations, aircraft} = createIndustryData(8, 12);

            (organizationService.getAllOrganizations as jest.Mock).mockResolvedValue(organizations);
            (aircraftService.getAllAircraft as jest.Mock).mockResolvedValue(aircraft);

            const [orgsResponse, aircraftResponse] = await Promise.all([
                request(app).get("/api/organizations"),
                request(app).get("/api/aircraft"),
            ]);

            const analysis = analyzeAircraftOrganizationRelationships(
                aircraftResponse.body.data,
                orgsResponse.body.data
            );

            expect(analysis.totalAircraft).toBe(96); // 8 × 12
            expect(analysis.totalOrganizations).toBe(8);
            expect(analysis.aircraftWithOrg).toBe(96); // All aircraft have organizations
            expect(analysis.orphanedAircraft).toBe(0); // No orphaned aircraft
            expect(analysis.organizationsWithAircraft).toBe(8); // All orgs have aircraft
        });
    });

    describe("Data Quality Validation", () => {
        it("should validate data quality for consistent dataset", async () => {
            const {organizations, aircraft} = createIndustryData(3, 5);

            (organizationService.getAllOrganizations as jest.Mock).mockResolvedValue(organizations);
            (aircraftService.getAllAircraft as jest.Mock).mockResolvedValue(aircraft);

            const [orgsResponse, aircraftResponse] = await Promise.all([
                request(app).get("/api/organizations"),
                request(app).get("/api/aircraft"),
            ]);

            const validation = validateDataQuality(aircraftResponse.body.data, orgsResponse.body.data);

            expect(validation.isValid).toBe(true);
            expect(validation.issues.length).toBe(0);
            expect(validation.summary.aircraftChecked).toBe(15);
            expect(validation.summary.organizationsChecked).toBe(3);
        });

        it("should detect orphaned aircraft references", async () => {
            const {organizations, aircraft} = createIndustryData(3, 5);

            // Add orphaned aircraft (references non-existent organization)
            const orphaned = {...aircraft[0], id: 999, organization_id: 9999};
            const allAircraft = [...aircraft, orphaned];

            (organizationService.getAllOrganizations as jest.Mock).mockResolvedValue(organizations);
            (aircraftService.getAllAircraft as jest.Mock).mockResolvedValue(allAircraft);

            const [orgsResponse, aircraftResponse] = await Promise.all([
                request(app).get("/api/organizations"),
                request(app).get("/api/aircraft"),
            ]);

            const validation = validateDataQuality(aircraftResponse.body.data, orgsResponse.body.data);

            expect(validation.isValid).toBe(false);
            expect(validation.issues.length).toBeGreaterThan(0);
            expect(validation.issues.some((i) => i.includes("non-existent organization"))).toBe(true);
        });
    });

    describe("Cross-Entity Statistics", () => {
        it("should calculate comprehensive statistics for both entities", async () => {
            const {organizations, aircraft} = createIndustryData(10, 8);

            (organizationService.getAllOrganizations as jest.Mock).mockResolvedValue(organizations);
            (aircraftService.getAllAircraft as jest.Mock).mockResolvedValue(aircraft);

            const [orgsResponse, aircraftResponse] = await Promise.all([
                request(app).get("/api/organizations"),
                request(app).get("/api/aircraft"),
            ]);

            const orgStats = calculateOrganizationStats(orgsResponse.body.data);
            const aircraftStats = calculateAircraftStats(aircraftResponse.body.data);

            expect(orgStats.total).toBe(10);
            expect(aircraftStats.total).toBe(80);
            expect(Object.keys(orgStats.byType).length).toBeGreaterThan(0);
            expect(Object.keys(aircraftStats.byType).length).toBeGreaterThan(0);
        });

        it("should analyze aircraft distribution per organization", async () => {
            const {organizations, aircraft} = createIndustryData(5, 10);

            (organizationService.getAllOrganizations as jest.Mock).mockResolvedValue(organizations);
            (aircraftService.getAllAircraft as jest.Mock).mockResolvedValue(aircraft);

            const [orgsResponse, aircraftResponse] = await Promise.all([
                request(app).get("/api/organizations"),
                request(app).get("/api/aircraft"),
            ]);

            const analysis = analyzeAircraftOrganizationRelationships(
                aircraftResponse.body.data,
                orgsResponse.body.data
            );

            analysis.aircraftPerOrganization.forEach((item) => {
                expect(item.count).toBe(10); // Each org should have 10 aircraft
            });
        });
    });

    describe("Organization Fleet Analysis", () => {
        it("should identify organizations with largest fleets", async () => {
            const {organizations, aircraft} = createIndustryData(6, 15);

            (organizationService.getAllOrganizations as jest.Mock).mockResolvedValue(organizations);
            (aircraftService.getAllAircraft as jest.Mock).mockResolvedValue(aircraft);

            const [orgsResponse, aircraftResponse] = await Promise.all([
                request(app).get("/api/organizations"),
                request(app).get("/api/aircraft"),
            ]);

            const analysis = analyzeAircraftOrganizationRelationships(
                aircraftResponse.body.data,
                orgsResponse.body.data
            );

            const fleetSizes = analysis.aircraftPerOrganization.map((a) => a.count);
            const maxFleet = Math.max(...fleetSizes);
            const minFleet = Math.min(...fleetSizes);

            expect(maxFleet).toBeGreaterThanOrEqual(minFleet);
            expect(maxFleet).toBe(15); // Each org has 15 aircraft
        });

        it("should identify organizations without aircraft", async () => {
            const {organizations, aircraft} = createIndustryData(5, 10);

            // Add organization without aircraft
            const emptyOrg = {
                id: 999,
                name: "Empty Org",
                type: "other" as const,
                country: "Mars",
                founding_year: 2024,
                logo_url: null,
            };
            const allOrgs = [...organizations, emptyOrg];

            (organizationService.getAllOrganizations as jest.Mock).mockResolvedValue(allOrgs);
            (aircraftService.getAllAircraft as jest.Mock).mockResolvedValue(aircraft);

            const [orgsResponse, aircraftResponse] = await Promise.all([
                request(app).get("/api/organizations"),
                request(app).get("/api/aircraft"),
            ]);

            const analysis = analyzeAircraftOrganizationRelationships(
                aircraftResponse.body.data,
                orgsResponse.body.data
            );

            expect(analysis.organizationsWithoutAircraft).toBe(1);
            expect(analysis.organizationsWithAircraft).toBe(5);
        });
    });

    describe("Type Correlation Analysis", () => {
        it("should analyze aircraft types per organization type", async () => {
            const {organizations, aircraft} = createIndustryData(4, 20);

            (organizationService.getAllOrganizations as jest.Mock).mockResolvedValue(organizations);
            (aircraftService.getAllAircraft as jest.Mock).mockResolvedValue(aircraft);

            const [orgsResponse, aircraftResponse] = await Promise.all([
                request(app).get("/api/organizations"),
                request(app).get("/api/aircraft"),
            ]);

            // Group aircraft by organization type
            const orgMap = new Map(orgsResponse.body.data.map((o: any) => [o.id, o]));
            const typeCorrelation: Record<string, string[]> = {};

            aircraftResponse.body.data.forEach((aircraft: any) => {
                if (aircraft.organization_id) {
                    const org = orgMap.get(aircraft.organization_id) as {type: string} | undefined;
                    if (org) {
                        if (!typeCorrelation[org.type]) {
                            typeCorrelation[org.type] = [];
                        }
                        typeCorrelation[org.type].push(aircraft.type);
                    }
                }
            });

            expect(Object.keys(typeCorrelation).length).toBeGreaterThan(0);
        });
    });

    describe("Performance with Combined Large Datasets", () => {
        it("should handle large combined datasets efficiently", async () => {
            const {organizations, aircraft} = createIndustryData(20, 50);

            (organizationService.getAllOrganizations as jest.Mock).mockResolvedValue(organizations);
            (aircraftService.getAllAircraft as jest.Mock).mockResolvedValue(aircraft);

            const startTime = Date.now();
            const [orgsResponse, aircraftResponse] = await Promise.all([
                request(app).get("/api/organizations"),
                request(app).get("/api/aircraft"),
            ]);
            const endTime = Date.now();

            expectSuccessResponse(orgsResponse);
            expectSuccessResponse(aircraftResponse);

            expect(orgsResponse.body.count).toBe(20);
            expect(aircraftResponse.body.count).toBe(1000); // 20 × 50
            expect(endTime - startTime).toBeLessThan(2000); // Should complete within 2 seconds
        });

        it("should perform complex analysis on large datasets quickly", async () => {
            const {organizations, aircraft} = createIndustryData(15, 40);

            (organizationService.getAllOrganizations as jest.Mock).mockResolvedValue(organizations);
            (aircraftService.getAllAircraft as jest.Mock).mockResolvedValue(aircraft);

            const [orgsResponse, aircraftResponse] = await Promise.all([
                request(app).get("/api/organizations"),
                request(app).get("/api/aircraft"),
            ]);

            const startAnalysis = Date.now();
            const validation = validateDataQuality(aircraftResponse.body.data, orgsResponse.body.data);
            const analysis = analyzeAircraftOrganizationRelationships(
                aircraftResponse.body.data,
                orgsResponse.body.data
            );
            const endAnalysis = Date.now();

            expect(validation.summary.aircraftChecked).toBe(600);
            expect(analysis.totalAircraft).toBe(600);
            expect(endAnalysis - startAnalysis).toBeLessThan(200); // Analysis should be fast
        });
    });

    describe("Data Consistency Checks", () => {
        it("should verify all aircraft references exist in organizations", async () => {
            const {organizations, aircraft} = createIndustryData(5, 8);

            (organizationService.getAllOrganizations as jest.Mock).mockResolvedValue(organizations);
            (aircraftService.getAllAircraft as jest.Mock).mockResolvedValue(aircraft);

            const [orgsResponse, aircraftResponse] = await Promise.all([
                request(app).get("/api/organizations"),
                request(app).get("/api/aircraft"),
            ]);

            const orgIds = new Set(orgsResponse.body.data.map((o: any) => o.id));

            aircraftResponse.body.data.forEach((aircraft: any) => {
                if (aircraft.organization_id !== null) {
                    expect(orgIds.has(aircraft.organization_id)).toBe(true);
                }
            });
        });

        it("should verify data integrity across parallel requests", async () => {
            const {organizations, aircraft} = createIndustryData(3, 10);

            (organizationService.getAllOrganizations as jest.Mock).mockResolvedValue(organizations);
            (aircraftService.getAllAircraft as jest.Mock).mockResolvedValue(aircraft);

            // Make multiple parallel requests
            const requests = Array(5)
                .fill(null)
                .map(() => Promise.all([request(app).get("/api/organizations"), request(app).get("/api/aircraft")]));

            const results = await Promise.all(requests);

            // All requests should return same data
            results.forEach(([orgRes, aircraftRes]) => {
                expect(orgRes.body.count).toBe(3);
                expect(aircraftRes.body.count).toBe(30);
            });
        });
    });
});
