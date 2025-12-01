import {Aircraft} from "../../src/models/Aircraft";
import {Organization} from "../../src/models/Organization";

/**
 * Advanced test helpers for complex scenarios
 */

/**
 * Create aircraft with organization relationship
 */
export const createAircraftWithOrganization = (
    aircraftData: Partial<Aircraft>,
    orgData: Partial<Organization>
): {aircraft: Aircraft; organization: Organization} => {
    const organization: Organization = {
        id: 1,
        name: "Test Org",
        type: "commercial",
        country: "USA",
        founding_year: 2000,
        logo_url: null,
        ...orgData,
    };

    const aircraft: Aircraft = {
        id: 1,
        name: "Test Aircraft",
        manufacturer: "Test Mfg",
        model: "TEST-100",
        year_built: 2020,
        weight: 50000.0,
        organization_id: organization.id,
        crew_capacity: 2,
        passenger_capacity: 100,
        type: "commercial",
        museum_location_number: null,
        display_section: null,
        qr_code_url: null,
        description: "Test aircraft",
        status: "in storage",
        ...aircraftData,
    };

    return {aircraft, organization};
};

/**
 * Create a fleet of aircraft for one organization
 */
export const createFleet = (orgId: number, count: number): Aircraft[] => {
    const types: Aircraft["type"][] = ["military", "commercial", "cargo", "rotorcraft"];
    const statuses: Aircraft["status"][] = ["on display", "in storage", "under restoration"];

    return Array.from({length: count}, (_, i) => ({
        id: i + 1,
        name: `Aircraft ${i + 1}`,
        manufacturer: `Manufacturer ${(i % 3) + 1}`,
        model: `Model-${i + 100}`,
        year_built: 2000 + i,
        weight: 50000.0 + i * 1000,
        organization_id: orgId,
        crew_capacity: 2,
        passenger_capacity: 100 + i * 10,
        type: types[i % types.length],
        museum_location_number: i + 1,
        display_section: `Section ${(i % 5) + 1}`,
        qr_code_url: null,
        description: `Test aircraft ${i + 1}`,
        status: statuses[i % statuses.length],
    }));
};

/**
 * Filter helpers
 */
export const filterByType = <T extends {type: string}>(items: T[], type: string): T[] => {
    return items.filter((item) => item.type === type);
};

export const filterByStatus = (aircraft: Aircraft[], status: Aircraft["status"]): Aircraft[] => {
    return aircraft.filter((a) => a.status === status);
};

export const filterByCountry = (orgs: Organization[], country: string): Organization[] => {
    return orgs.filter((org) => org.country === country);
};

/**
 * Assertion helpers for complex objects
 */
export const assertAircraftStructure = (aircraft: any) => {
    // Required fields
    expect(aircraft).toHaveProperty("id");
    expect(aircraft).toHaveProperty("name");
    expect(aircraft).toHaveProperty("manufacturer");
    expect(aircraft).toHaveProperty("model");
    expect(aircraft).toHaveProperty("year_built");
    expect(aircraft).toHaveProperty("weight");
    expect(aircraft).toHaveProperty("type");
    expect(aircraft).toHaveProperty("status");

    // Type checks
    expect(typeof aircraft.id).toBe("number");
    expect(typeof aircraft.name).toBe("string");
    expect(typeof aircraft.manufacturer).toBe("string");
    expect(typeof aircraft.model).toBe("string");
    expect(typeof aircraft.year_built).toBe("number");
    expect(typeof aircraft.weight).toBe("number");
    expect(typeof aircraft.type).toBe("string");
    expect(typeof aircraft.status).toBe("string");
};

export const assertOrganizationStructure = (org: any) => {
    // Required fields
    expect(org).toHaveProperty("id");
    expect(org).toHaveProperty("name");
    expect(org).toHaveProperty("type");
    expect(org).toHaveProperty("country");

    // Type checks
    expect(typeof org.id).toBe("number");
    expect(typeof org.name).toBe("string");
    expect(typeof org.type).toBe("string");
    expect(typeof org.country).toBe("string");

    // Optional fields
    if (org.founding_year !== null) {
        expect(typeof org.founding_year).toBe("number");
    }
    if (org.logo_url !== null) {
        expect(typeof org.logo_url).toBe("string");
    }
};

/**
 * Response validation helpers
 */
export const assertListResponseStructure = (response: any, dataKey: string = "data") => {
    expect(response.body).toHaveProperty("success");
    expect(response.body).toHaveProperty("message");
    expect(response.body).toHaveProperty(dataKey);
    expect(response.body).toHaveProperty("count");
    expect(Array.isArray(response.body[dataKey])).toBe(true);
    expect(response.body.count).toBe(response.body[dataKey].length);
};

export const assertSingleResponseStructure = (response: any, dataKey: string = "data") => {
    expect(response.body).toHaveProperty("success");
    expect(response.body).toHaveProperty("message");
    expect(response.body).toHaveProperty(dataKey);
    expect(response.body).not.toHaveProperty("count");
    expect(typeof response.body[dataKey]).toBe("object");
};

/**
 * Data generators for edge cases
 */
export const createAircraftWithEdgeCases = () => ({
    minimal: {
        id: 1,
        name: "A",
        manufacturer: "M",
        model: "X",
        year_built: 1900,
        weight: 0.01,
        organization_id: null,
        crew_capacity: null,
        passenger_capacity: null,
        type: "other" as const,
        museum_location_number: null,
        display_section: null,
        qr_code_url: null,
        description: null,
        status: "decommissioned" as const,
    },
    maximal: {
        id: 999999,
        name: "Very Long Aircraft Name That Tests Maximum Length",
        manufacturer: "Very Long Manufacturer Name",
        model: "ULTRA-LONG-MODEL-NUMBER-9999",
        year_built: 2099,
        weight: 999999.99,
        organization_id: 999,
        crew_capacity: 999,
        passenger_capacity: 9999,
        type: "military" as const,
        museum_location_number: 999,
        display_section: "Maximum Display Section Name",
        qr_code_url: "https://example.com/very-long-url/qr-code-path",
        description: "Very long description ".repeat(50),
        status: "on display" as const,
    },
});

/**
 * Create organizations with multiple aircraft (Industry data)
 */
export const createIndustryData = (orgCount: number, aircraftPerOrg: number) => {
    const organizations: Organization[] = [];
    const allAircraft: Aircraft[] = [];

    const orgTypes: Organization["type"][] = ["airline", "military", "commercial"];
    const countries = ["USA", "France", "Finland", "Germany", "Japan", "UK"];

    for (let i = 0; i < orgCount; i++) {
        const org: Organization = {
            id: i + 1,
            name: `Organization ${i + 1}`,
            type: orgTypes[i % orgTypes.length],
            country: countries[i % countries.length],
            founding_year: 1900 + i * 10,
            logo_url: i % 2 === 0 ? `https://example.com/logo${i}.png` : null,
        };
        organizations.push(org);

        // Create aircraft for this organization
        const orgAircraft = createFleet(org.id, aircraftPerOrg);
        allAircraft.push(...orgAircraft);
    }

    return {organizations, aircraft: allAircraft};
};

/**
 * Create organization with specific characteristics
 */
export const createOrganizationWithEdgeCases = () => ({
    minimal: {
        id: 1,
        name: "A",
        type: "other" as const,
        country: "XX",
        founding_year: undefined,
        logo_url: null,
    },
    maximal: {
        id: 999999,
        name: "Very Long Organization Name That Tests Maximum Length Limits",
        type: "postal_service" as const,
        country: "United States of America",
        founding_year: 1800,
        logo_url: "https://example.com/very-very-very-long-url-path/to/logo/image.png",
    },
    historic: {
        id: 2,
        name: "Ancient Airways",
        type: "airline" as const,
        country: "Greece",
        founding_year: 1903,
        logo_url: null,
    },
    modern: {
        id: 3,
        name: "FutureTech Aviation",
        type: "commercial" as const,
        country: "Singapore",
        founding_year: 2023,
        logo_url: "https://cdn.example.com/modern-logo.svg",
    },
});

/**
 * Statistics helpers
 */
export const calculateAircraftStats = (aircraft: Aircraft[]) => ({
    total: aircraft.length,
    byType: aircraft.reduce((acc, a) => {
        acc[a.type] = (acc[a.type] || 0) + 1;
        return acc;
    }, {} as Record<string, number>),
    byStatus: aircraft.reduce((acc, a) => {
        acc[a.status] = (acc[a.status] || 0) + 1;
        return acc;
    }, {} as Record<string, number>),
    averageWeight: aircraft.reduce((sum, a) => sum + a.weight, 0) / aircraft.length,
    averageYear: aircraft.reduce((sum, a) => sum + a.year_built, 0) / aircraft.length,
    withOrganization: aircraft.filter((a) => a.organization_id !== null).length,
    withoutOrganization: aircraft.filter((a) => a.organization_id === null).length,
});

export const calculateOrganizationStats = (orgs: Organization[]) => {
    const withFoundingYear = orgs.filter((o) => o.founding_year !== null && o.founding_year !== undefined);

    return {
        total: orgs.length,
        byType: orgs.reduce((acc, o) => {
            acc[o.type] = (acc[o.type] || 0) + 1;
            return acc;
        }, {} as Record<string, number>),
        byCountry: orgs.reduce((acc, o) => {
            acc[o.country] = (acc[o.country] || 0) + 1;
            return acc;
        }, {} as Record<string, number>),
        withLogo: orgs.filter((o) => o.logo_url !== null).length,
        withoutLogo: orgs.filter((o) => o.logo_url === null).length,
        withFoundingYear: withFoundingYear.length,
        averageAge:
            withFoundingYear.length > 0
                ? withFoundingYear.reduce((sum, o) => sum + (2025 - o.founding_year!), 0) / withFoundingYear.length
                : 0,
        oldestYear: withFoundingYear.length > 0 ? Math.min(...withFoundingYear.map((o) => o.founding_year!)) : null,
        newestYear: withFoundingYear.length > 0 ? Math.max(...withFoundingYear.map((o) => o.founding_year!)) : null,
    };
};

/**
 * Relationship analysis helpers
 */
export const analyzeAircraftOrganizationRelationships = (aircraft: Aircraft[], organizations: Organization[]) => {
    const orgMap = new Map(organizations.map((o) => [o.id, o]));

    return {
        totalAircraft: aircraft.length,
        totalOrganizations: organizations.length,
        aircraftWithOrg: aircraft.filter((a) => a.organization_id !== null).length,
        aircraftWithoutOrg: aircraft.filter((a) => a.organization_id === null).length,
        orphanedAircraft: aircraft.filter((a) => a.organization_id !== null && !orgMap.has(a.organization_id)).length,
        organizationsWithAircraft: organizations.filter((org) => aircraft.some((a) => a.organization_id === org.id))
            .length,
        organizationsWithoutAircraft: organizations.filter((org) => !aircraft.some((a) => a.organization_id === org.id))
            .length,
        aircraftPerOrganization: organizations.map((org) => ({
            organization: org.name,
            count: aircraft.filter((a) => a.organization_id === org.id).length,
        })),
    };
};

/**
 * Data quality helpers
 */
export const validateDataQuality = (aircraft: Aircraft[], organizations: Organization[]) => {
    const issues: string[] = [];

    // Check for duplicate IDs
    const aircraftIds = aircraft.map((a) => a.id);
    const uniqueAircraftIds = new Set(aircraftIds);
    if (aircraftIds.length !== uniqueAircraftIds.size) {
        issues.push("Duplicate aircraft IDs found");
    }

    const orgIds = organizations.map((o) => o.id);
    const uniqueOrgIds = new Set(orgIds);
    if (orgIds.length !== uniqueOrgIds.size) {
        issues.push("Duplicate organization IDs found");
    }

    // Check for orphaned references
    const orgIdSet = new Set(organizations.map((o) => o.id));
    aircraft.forEach((a) => {
        if (a.organization_id !== null && !orgIdSet.has(a.organization_id)) {
            issues.push(`Aircraft ${a.name} references non-existent organization ID ${a.organization_id}`);
        }
    });

    // Check for missing required fields
    aircraft.forEach((a) => {
        if (!a.name || !a.manufacturer || !a.model) {
            issues.push(`Aircraft ${a.id} has missing required fields`);
        }
    });

    organizations.forEach((o) => {
        if (!o.name || !o.type || !o.country) {
            issues.push(`Organization ${o.id} has missing required fields`);
        }
    });

    return {
        isValid: issues.length === 0,
        issues,
        summary: {
            totalIssues: issues.length,
            aircraftChecked: aircraft.length,
            organizationsChecked: organizations.length,
        },
    };
};
