import request from "supertest";
import app from "../../src/app";
import aircraftService from "../../src/services/AircraftService";
import {
    createFleet,
    createAircraftWithOrganization,
    createAircraftWithEdgeCases,
    filterByStatus,
    assertAircraftStructure,
    assertListResponseStructure,
    calculateAircraftStats,
} from "../utils/advancedHelpers";
import {expectSuccessResponse} from "../utils/testHelpers";

jest.mock("../../src/services/AircraftService");

describe("Aircraft Advanced Tests", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("Fleet Management", () => {
        it("should handle a fleet of aircraft for one organization", async () => {
            const fleet = createFleet(1, 10);
            (aircraftService.getAllAircraft as jest.Mock).mockResolvedValue(fleet);

            const response = await request(app).get("/api/aircraft");

            expectSuccessResponse(response);
            expect(response.body.count).toBe(10);

            // All aircraft should belong to same organization
            const orgIds = [...new Set(fleet.map((a) => a.organization_id))];
            expect(orgIds.length).toBe(1);
            expect(orgIds[0]).toBe(1);
        });

        it("should filter aircraft by status using helper", async () => {
            const fleet = createFleet(1, 20);
            (aircraftService.getAllAircraft as jest.Mock).mockResolvedValue(fleet);

            const response = await request(app).get("/api/aircraft");

            const onDisplay = filterByStatus(response.body.data, "on display");
            const inStorage = filterByStatus(response.body.data, "in storage");

            expect(onDisplay.length + inStorage.length).toBeLessThanOrEqual(20);
        });
    });

    describe("Aircraft with Organization Relationship", () => {
        it("should handle aircraft with complete organization data", async () => {
            const {aircraft, organization} = createAircraftWithOrganization(
                {name: "F-16 Fighting Falcon", type: "military"},
                {name: "US Air Force", type: "military", country: "USA"}
            );

            (aircraftService.getAircraftById as jest.Mock).mockResolvedValue(aircraft);

            const response = await request(app).get(`/api/aircraft/${aircraft.id}`);

            expectSuccessResponse(response);
            expect(response.body.data.organization_id).toBe(organization.id);
            expect(response.body.data.type).toBe("military");
        });
    });

    describe("Edge Cases", () => {
        it("should handle minimal aircraft data", async () => {
            const edgeCases = createAircraftWithEdgeCases();
            (aircraftService.getAircraftById as jest.Mock).mockResolvedValue(edgeCases.minimal);

            const response = await request(app).get("/api/aircraft/1");

            expectSuccessResponse(response);
            assertAircraftStructure(response.body.data);

            expect(response.body.data.name).toBe("A");
            expect(response.body.data.weight).toBe(0.01);
        });

        it("should handle maximal aircraft data", async () => {
            const edgeCases = createAircraftWithEdgeCases();
            (aircraftService.getAircraftById as jest.Mock).mockResolvedValue(edgeCases.maximal);

            const response = await request(app).get("/api/aircraft/999999");

            expectSuccessResponse(response);
            assertAircraftStructure(response.body.data);

            expect(response.body.data.weight).toBe(999999.99);
            expect(response.body.data.passenger_capacity).toBe(9999);
        });
    });

    describe("Data Structure Validation", () => {
        it("should validate all aircraft have correct structure", async () => {
            const fleet = createFleet(1, 5);
            (aircraftService.getAllAircraft as jest.Mock).mockResolvedValue(fleet);

            const response = await request(app).get("/api/aircraft");

            assertListResponseStructure(response);

            response.body.data.forEach((aircraft: any) => {
                assertAircraftStructure(aircraft);
            });
        });
    });

    describe("Statistics and Analytics", () => {
        it("should calculate fleet statistics correctly", async () => {
            const fleet = createFleet(1, 30);
            (aircraftService.getAllAircraft as jest.Mock).mockResolvedValue(fleet);

            const response = await request(app).get("/api/aircraft");

            const stats = calculateAircraftStats(response.body.data);

            expect(stats.total).toBe(30);
            expect(stats.averageWeight).toBeGreaterThan(0);
            expect(stats.averageYear).toBeGreaterThan(1900);
            expect(Object.keys(stats.byType).length).toBeGreaterThan(0);
            expect(Object.keys(stats.byStatus).length).toBeGreaterThan(0);
        });

        it("should group aircraft by type", async () => {
            const fleet = createFleet(1, 20);
            (aircraftService.getAllAircraft as jest.Mock).mockResolvedValue(fleet);

            const response = await request(app).get("/api/aircraft");

            const stats = calculateAircraftStats(response.body.data);
            const types = Object.keys(stats.byType);

            expect(types.length).toBeGreaterThan(0);
            types.forEach((type) => {
                expect(stats.byType[type]).toBeGreaterThan(0);
            });
        });
    });

    describe("Performance with Large Datasets", () => {
        it("should handle large fleet efficiently", async () => {
            const largeFleet = createFleet(1, 100);
            (aircraftService.getAllAircraft as jest.Mock).mockResolvedValue(largeFleet);

            const startTime = Date.now();
            const response = await request(app).get("/api/aircraft");
            const endTime = Date.now();

            expectSuccessResponse(response);
            expect(response.body.count).toBe(100);
            expect(endTime - startTime).toBeLessThan(1000); // Should respond within 1 second
        });
    });
});
