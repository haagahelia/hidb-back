import db from '../config/database';
import { Aircraft } from '../models/Aircraft';

export class AircraftService {
    private readonly tableName = 'Aircraft';

    /**
     * Get all aircrafts from the database
     */
    async getAllAircrafts(): Promise<Aircraft[]> {
        try {
            const aircrafts = await db(this.tableName)
                .select('*')
                .orderBy('id', 'asc');
            
            return aircrafts;
        } catch (error) {
            throw new Error(`Error fetching aircrafts: ${error}`);
        }
    }

    /**
     * Get aircraft by ID
     */
    async getAircraftById(id: number): Promise<Aircraft | null> {
        try {
            const aircraft = await db(this.tableName)
                .where('id', id)
                .first();
            
            return aircraft || null;
        } catch (error) {
            throw new Error(`Error fetching aircraft with ID ${id}: ${error}`);
        }
    }

}

export default new AircraftService();