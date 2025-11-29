import db from "../config/database";
import {Aircraft} from "../models/Aircraft";

export class AircraftService {
    private readonly tableName = "Aircraft";

    /**
     * Get all aircraft from the database using Knex
     */
    async getAllAircraft(): Promise<Aircraft[]> {
        try {
            const aircraft = await db(this.tableName)
                .select("Aircraft.*", "Media.url as thumbnail_url", "Media.caption as thumbnail_caption")
                .leftJoin("Media", function () {
                    this.on("Media.aircraft_id", "=", "Aircraft.id").andOn("Media.is_thumbnail", "=", db.raw("TRUE"));
                })
                .orderBy("Aircraft.id", "asc");

            return aircraft;
        } catch (error) {
            throw new Error(`Error fetching aircraft: ${error}`);
        }
    }

    /**
     * Get aircraft by ID using Knex
     */
    async getAircraftById(id: number): Promise<Aircraft | null> {
        try {
            const aircraft = await db(this.tableName)
                .select("Aircraft.*", "Media.url as thumbnail_url", "Media.caption as thumbnail_caption")
                .leftJoin("Media", function () {
                    this.on("Media.aircraft_id", "=", "Aircraft.id").andOn("Media.is_thumbnail", "=", db.raw("TRUE"));
                })
                .where("Aircraft.id", id)
                .first();

            return aircraft || null;
        } catch (error) {
            throw new Error(`Error fetching aircraft with ID ${id}: ${error}`);
        }
    }
}

export default new AircraftService();
