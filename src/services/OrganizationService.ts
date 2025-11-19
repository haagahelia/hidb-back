import db from "../config/database";
import {Organization} from "../models/Organization";

export class OrganizationService {
    private readonly tableName = "Organization";

    /**
     * Get all organizations from the database using Knex
     */
    async getAllOrganizations(): Promise<Organization[]> {
        try {
            const organizations = await db(this.tableName).select("*").orderBy("id", "asc");

            return organizations;
        } catch (error) {
            throw new Error(`Error fetching organizations: ${error}`);
        }
    }

    /**
     * Get organization by ID using Knex
     */
    async getOrganizationById(id: number): Promise<Organization | null> {
        try {
            const organization = await db(this.tableName).where("id", id).first();

            return organization || null;
        } catch (error) {
            throw new Error(`Error fetching organization with ID ${id}: ${error}`);
        }
    }
}

export default new OrganizationService();
