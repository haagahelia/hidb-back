export interface Organization {
    id: number;
    name: string;
    type: "airline" | "military" | "border_guard" | "postal_service" | "commercial" | "other";
    country: string;
    founding_year: number | null;
    logo_url: string | null;
}