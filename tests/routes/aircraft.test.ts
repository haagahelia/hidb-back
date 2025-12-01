import request from "supertest";
import app from "../../src/app";
import aircraftService from "../../src/services/AircraftService";
import {
    createRealWorldAircraft,
    createMultipleMockAircraft,
    expectSuccessResponse,
    expectErrorResponse,
    isValidAircraftType,
    isValidAircraftStatus,
} from "../utils/testHelpers";

// Mock AircraftService
jest.mock("../../src/services/AircraftService");

describe("Aircraft Routes", () => {
    const mockAircraft = [
        createRealWorldAircraft.airbus(),
        createRealWorldAircraft.boeing(),
        createRealWorldAircraft.cargo(),
    ];

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("GET /api/aircraft", () => {
        it("should return all aircraft with status 200", async () => {
            (aircraftService.getAllAircraft as jest.Mock).mockResolvedValue(mockAircraft);

            const response = await request(app).get("/api/aircraft").expect("Content-Type", /json/).expect(200);

            expectSuccessResponse(response, 200);
            expect(response.body.message).toBe("Aircraft retrieved successfully");
            expect(response.body.data).toEqual(mockAircraft);
            expect(response.body.count).toBe(3);
        });

        it("should return empty array when no aircraft exist", async () => {
            (aircraftService.getAllAircraft as jest.Mock).mockResolvedValue([]);

            const response = await request(app).get("/api/aircraft").expect(200);

            expectSuccessResponse(response, 200);
            expect(response.body.data).toEqual([]);
            expect(response.body.count).toBe(0);
        });

        it("should handle database errors gracefully", async () => {
            (aircraftService.getAllAircraft as jest.Mock).mockRejectedValue(new Error("Database connection failed"));

            const response = await request(app).get("/api/aircraft").expect(500);

            expectErrorResponse(response, 500, "Error retrieving aircraft from database");
        });

        it("should return multiple aircraft using helper", async () => {
            const manyAircraft = createMultipleMockAircraft(10);
            (aircraftService.getAllAircraft as jest.Mock).mockResolvedValue(manyAircraft);

            const response = await request(app).get("/api/aircraft");

            expectSuccessResponse(response);
            expect(response.body.count).toBe(10);
            expect(response.body.data.length).toBe(10);
        });
    });

    describe("GET /api/aircraft/:id", () => {
        it("should return specific aircraft by ID", async () => {
            const airbusA320 = createRealWorldAircraft.airbus();
            (aircraftService.getAircraftById as jest.Mock).mockResolvedValue(airbusA320);

            const response = await request(app).get("/api/aircraft/1").expect("Content-Type", /json/).expect(200);

            expectSuccessResponse(response, 200);
            expect(response.body.message).toBe("Aircraft retrieved successfully");
            expect(response.body.data).toEqual(airbusA320);
            expect(response.body.data.name).toBe("A320");
        });

        it("should return 404 when aircraft not found", async () => {
            (aircraftService.getAircraftById as jest.Mock).mockResolvedValue(null);

            const response = await request(app).get("/api/aircraft/999").expect(404);

            expectErrorResponse(response, 404, "Aircraft not found");
        });

        it("should return 400 for invalid ID format", async () => {
            const response = await request(app).get("/api/aircraft/invalid").expect(400);

            expectErrorResponse(response, 400, "Invalid aircraft ID");
        });

        it("should handle database errors for specific aircraft", async () => {
            (aircraftService.getAircraftById as jest.Mock).mockRejectedValue(new Error("Database query failed"));

            const response = await request(app).get("/api/aircraft/1").expect(500);

            expectErrorResponse(response, 500, "Error retrieving aircraft from database");
        });
    });

    describe("Aircraft Response Structure", () => {
        it("should return aircraft with all required fields", async () => {
            const aircraft = createRealWorldAircraft.airbus();
            (aircraftService.getAircraftById as jest.Mock).mockResolvedValue(aircraft);

            const response = await request(app).get("/api/aircraft/1");

            // Required fields
            expect(response.body.data).toHaveProperty("id");
            expect(response.body.data).toHaveProperty("name");
            expect(response.body.data).toHaveProperty("manufacturer");
            expect(response.body.data).toHaveProperty("model");
            expect(response.body.data).toHaveProperty("year_built");
            expect(response.body.data).toHaveProperty("weight");
            expect(response.body.data).toHaveProperty("type");
            expect(response.body.data).toHaveProperty("status");
        });

        it("should have valid ENUM values for type field", async () => {
            (aircraftService.getAllAircraft as jest.Mock).mockResolvedValue(mockAircraft);

            const response = await request(app).get("/api/aircraft");

            response.body.data.forEach((aircraft: any) => {
                expect(isValidAircraftType(aircraft.type)).toBe(true);
            });
        });

        it("should have valid ENUM values for status field", async () => {
            (aircraftService.getAllAircraft as jest.Mock).mockResolvedValue(mockAircraft);

            const response = await request(app).get("/api/aircraft");

            response.body.data.forEach((aircraft: any) => {
                expect(isValidAircraftStatus(aircraft.status)).toBe(true);
            });
        });

        it("should handle optional fields correctly", async () => {
            const aircraft = createRealWorldAircraft.airbus();
            (aircraftService.getAircraftById as jest.Mock).mockResolvedValue(aircraft);

            const response = await request(app).get("/api/aircraft/1");

            // Optional fields
            expect(response.body.data).toHaveProperty("organization_id");
            expect(response.body.data).toHaveProperty("crew_capacity");
            expect(response.body.data).toHaveProperty("passenger_capacity");
            expect(response.body.data).toHaveProperty("museum_location_number");
            expect(response.body.data).toHaveProperty("display_section");
            expect(response.body.data).toHaveProperty("qr_code_url");
            expect(response.body.data).toHaveProperty("description");
        });
    });

    describe("Aircraft Types", () => {
        it("should correctly identify commercial aircraft", async () => {
            const commercial = createRealWorldAircraft.airbus();
            (aircraftService.getAircraftById as jest.Mock).mockResolvedValue(commercial);

            const response = await request(app).get("/api/aircraft/1");

            expect(response.body.data.type).toBe("commercial");
            expect(response.body.data.passenger_capacity).toBeDefined();
        });

        it("should correctly identify cargo aircraft", async () => {
            const cargo = createRealWorldAircraft.cargo();
            (aircraftService.getAircraftById as jest.Mock).mockResolvedValue(cargo);

            const response = await request(app).get("/api/aircraft/3");

            expect(response.body.data.type).toBe("cargo");
            expect(response.body.data.name).toBe("CRJ900");
        });

        it("should handle all aircraft types correctly", async () => {
            const allTypes = createMultipleMockAircraft(6);
            (aircraftService.getAllAircraft as jest.Mock).mockResolvedValue(allTypes);

            const response = await request(app).get("/api/aircraft");

            const types = [...new Set(response.body.data.map((a: any) => a.type))];
            types.forEach((type) => {
                expect(isValidAircraftType(type as string)).toBe(true);
            });
        });
    });
});
