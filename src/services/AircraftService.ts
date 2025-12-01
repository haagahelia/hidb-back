import db from "../config/database";
import {Aircraft} from "../models/Aircraft";

// before JSON parsing. Knex/Database returns JSON columns as strings.
interface RawAircraftRow extends Omit<Aircraft, 'specifications' | 'fun_facts'> {
    specifications: string | null;
    fun_facts: string | null;
}

export class AircraftService {
    private readonly tableName = "Aircraft";

    /**
     * Get all aircraft from the database using Knex
     */
    // Helper function to parse JSON fields from a single row
    private parseAircraftJson(aircraft: RawAircraftRow): Aircraft {
        // Ensure the row exists before attempting to parse
        if (!aircraft) return aircraft as unknown as Aircraft; 

        return {
            ...aircraft,
            // Safely parse specifications. If the string is null/empty, use null.
            specifications: aircraft.specifications 
                ? JSON.parse(aircraft.specifications) 
                : null,
            // Safely parse fun_facts. If the string is null/empty, use null.
            fun_facts: aircraft.fun_facts 
                ? JSON.parse(aircraft.fun_facts) 
                : null,
        } as Aircraft;
    }

    async getAllAircraft(): Promise<Aircraft[]> {
        try {
            const rawAircraft: RawAircraftRow[] = await db(this.tableName)
                .select("Aircraft.*", "Media.url as thumbnail_url", "Media.caption as thumbnail_caption")
                .leftJoin("Media", function () {
                    this.on("Media.aircraft_id", "=", "Aircraft.id").andOn("Media.is_thumbnail", "=", db.raw("TRUE"));
                })
                .orderBy("Aircraft.id", "asc");

            return rawAircraft.map(this.parseAircraftJson); 
        } catch (error) {
            throw new Error(`Error fetching aircraft: ${error}`);
        }
    }

    /**
     * Get aircraft by ID using Knex
     */
    async getAircraftById(id: number): Promise<Aircraft | null> {
        try {
            const rawAircraft: RawAircraftRow | undefined = await db(this.tableName)
                .select("Aircraft.*", "Media.url as thumbnail_url", "Media.caption as thumbnail_caption")
                .leftJoin("Media", function () {
                    this.on("Media.aircraft_id", "=", "Aircraft.id").andOn("Media.is_thumbnail", "=", db.raw("TRUE"));
                })
                .where("Aircraft.id", id)
                .first();

            if (!rawAircraft) {
                return null; // Aircraft not found
            }

            return this.parseAircraftJson(rawAircraft);
        } catch (error) {
            throw new Error(`Error fetching aircraft with ID ${id}: ${error}`);
        }
    }
}

export default new AircraftService();
