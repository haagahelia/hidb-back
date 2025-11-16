import {Aircraft} from "../../src/models/Aircraft";
import {Organization} from "../../src/models/Organization";

/**
 * Helper functions for creating test data matching actual database schema
 */

export const createMockAircraft = (overrides?: Partial<Aircraft>): Aircraft => {
    return {
        id: 1,
        name: "Test Aircraft",
        manufacturer: "Test Manufacturer",
        model: "TEST-100",
        year_built: 2020,
        weight: 50000.0,
        organization_id: 1,
        crew_capacity: 2,
        passenger_capacity: 100,
        type: "commercial",
        museum_location_number: null,
        display_section: null,
        qr_code_url: null,
        description: "Test aircraft description",
        status: "in storage",
        ...overrides,
    };
};

export const createMockOrganization = (overrides?: Partial<Organization>): Organization => {
    return {
        id: 1,
        name: "Test Organization",
        type: "commercial",
        country: "Test Country",
        founding_year: 2000,
        logo_url: null,
        ...overrides,
    };
};

export const createMultipleMockAircraft = (count: number): Aircraft[] => {
    const types: Aircraft["type"][] = ["military", "commercial", "cargo", "rotorcraft", "general aviation", "other"];
    const statuses: Aircraft["status"][] = [
        "on display",
        "in storage",
        "under restoration",
        "loaned",
        "decommissioned",
    ];

    return Array.from({length: count}, (_, i) =>
        createMockAircraft({
            id: i + 1,
            name: `Aircraft ${i + 1}`,
            type: types[i % types.length],
            status: statuses[i % statuses.length],
        })
    );
};

export const createMultipleMockOrganizations = (count: number): Organization[] => {
    const types: Organization["type"][] = [
        "airline",
        "military",
        "border_guard",
        "postal_service",
        "commercial",
        "other",
    ];
    const countries = ["USA", "France", "Finland", "Germany", "Japan", "UK"];

    return Array.from({length: count}, (_, i) =>
        createMockOrganization({
            id: i + 1,
            name: `Organization ${i + 1}`,
            type: types[i % types.length],
            country: countries[i % countries.length],
        })
    );
};

/**
 * Create mock aircraft based on real database examples
 */
export const createRealWorldAircraft = {
    airbus: (): Aircraft => ({
        id: 1,
        name: "A320",
        manufacturer: "Airbus",
        model: "A320-200",
        year_built: 1998,
        weight: 73500.0,
        organization_id: 1,
        crew_capacity: 2,
        passenger_capacity: 150,
        type: "commercial",
        museum_location_number: null,
        display_section: null,
        qr_code_url: null,
        description: "A popular short-haul airliner.",
        status: "on display",
    }),

    boeing: (): Aircraft => ({
        id: 2,
        name: "B737",
        manufacturer: "Boeing",
        model: "737-800",
        year_built: 2005,
        weight: 79015.0,
        organization_id: 2,
        crew_capacity: 2,
        passenger_capacity: 160,
        type: "commercial",
        museum_location_number: null,
        display_section: null,
        qr_code_url: null,
        description: "A widely used medium-range airliner.",
        status: "in storage",
    }),

    cargo: (): Aircraft => ({
        id: 3,
        name: "CRJ900",
        manufacturer: "Bombardier",
        model: "CRJ900",
        year_built: 2003,
        weight: 37000.0,
        organization_id: 3,
        crew_capacity: 2,
        passenger_capacity: 90,
        type: "cargo",
        museum_location_number: null,
        display_section: null,
        qr_code_url: null,
        description: "An old regional jet with a capacity of 90 passengers, later modified into a cargo plane.",
        status: "in storage",
    }),
};

/**
 * Create mock organizations based on real database examples
 */
export const createRealWorldOrganizations = {
    nasa: (): Organization => ({
        id: 1,
        name: "NASA",
        type: "other",
        country: "USA",
        founding_year: 1958,
        logo_url: null,
    }),

    boeing: (): Organization => ({
        id: 2,
        name: "Boeing",
        type: "commercial",
        country: "USA",
        founding_year: 1916,
        logo_url: null,
    }),

    airbus: (): Organization => ({
        id: 3,
        name: "Airbus",
        type: "commercial",
        country: "France",
        founding_year: 1970,
        logo_url: null,
    }),
};

/**
 * Helper for testing error responses
 */
export const expectErrorResponse = (response: any, statusCode: number, message: string) => {
    expect(response.status).toBe(statusCode);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe(message);
};

/**
 * Helper for testing success responses
 */
export const expectSuccessResponse = (response: any, statusCode: number = 200) => {
    expect(response.status).toBe(statusCode);
    expect(response.body.success).toBe(true);
};

/**
 * Validate aircraft ENUM values
 */
export const isValidAircraftType = (type: string): boolean => {
    const validTypes = ["military", "commercial", "general aviation", "cargo", "rotorcraft", "other"];
    return validTypes.includes(type);
};

export const isValidAircraftStatus = (status: string): boolean => {
    const validStatuses = ["on display", "in storage", "under restoration", "loaned", "decommissioned"];
    return validStatuses.includes(status);
};

/**
 * Validate organization ENUM values
 */
export const isValidOrganizationType = (type: string): boolean => {
    const validTypes = ["airline", "military", "border_guard", "postal_service", "commercial", "other"];
    return validTypes.includes(type);
};
