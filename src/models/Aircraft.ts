export interface Aircraft {
    id: number;
    name: string;
    manufacturer: string;
    model: string;
    year_built: number;
    weight: number;
    organization_id: number | null;
    crew_capacity: number | null;
    passenger_capacity: number | null;
    type: "military" | "commercial" | "general aviation" | "cargo" | "rotorcraft" | "other";
    museum_location_number: number | null;
    display_section: string | null;
    qr_code_url: string | null;
    description: string | null;
    status: "on display" | "in storage" | "under restoration" | "loaned" | "decommissioned";
}
