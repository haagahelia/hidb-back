import db from '../config/database';
import { Media } from '../models/Media';

export class MediaService {
    private readonly tableName = 'Media';

    /* Get all media from the database */
    async getAllMedia(): Promise<Media[]> {
        try {
            const media = await db(this.tableName)
                .select('*')
                .orderBy('id', 'asc');

            return media;
        } catch (error) {
            throw new Error(`Error fetching media: ${error}`);
        }
    }

    /*Get media by ID */
    async getMediaById(id: number): Promise<Media | null> {
        try {
            const media = await db(this.tableName)
                .where('id', id)
                .first();

            return media || null;
        } catch (error) {
            throw new Error(`Error fetching media with ID ${id}: ${error}`);
        }
    }
}

export default new MediaService();