export interface Aircraft {
    id: number;
    name: string;
    manufacturer: string;
    model: string;
    year_built: number;
    weight: number;
    aircraft_type?: string;
    museum_location_number: number;
    display_section: string;
    description?: string;
}