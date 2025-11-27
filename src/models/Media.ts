export interface Media {
    id: number;
    aircraft_id: number | null;
    media_type: "photo" | "video" | "3d model" | "audio" | "other";
    is_thumbnail: boolean;
    url: string;
    caption: string | null;
    date_taken: Date | null;
    creator: string | null;
    is_historical: boolean;
}