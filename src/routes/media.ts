import { Router,Request,Response } from "express";
import mediaService from "../services/MediaService";
import { validateRequest } from "../validationHandler/index";
import { validateMediaId } from "../validationHandler/media";

const router = Router();

router.get("/media",
    validateRequest,
    async (req: Request, res: Response) => {
        try {
            const media = await mediaService.getAllMedia();

            res.status(200).json({
                success: true,
                message: "Media retrieved successfully",
                data: media,
                count: media.length
            });
        }catch (error) {
            console.error('Error fetching media:', error);
            res.status(500).json({
                success: false,
                message: "Error retrieving media from database",
                error: process.env.NODE_ENV === 'development' ? error : {}
            });
        }
    }
)

router.get("/media/:id",
    validateMediaId,
    validateRequest,
    async (req: Request, res: Response) => {
        try {
            const mediaId = parseInt(req.params.id);
            if (isNaN(mediaId)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid media ID"
                });
            }

            const media = await mediaService.getMediaById(mediaId);

            if (!media) {
                return res.status(404).json({
                    success: false,
                    message: "Media not found"
                });
            }

            res.status(200).json({
                success: true,
                message: "Media retrieved successfully",
                data: media
            });

        } catch (error) {
            console.error('Error fetching media:', error);
            res.status(500).json({
                success: false,
                message: "Error retrieving media from database",
                error: process.env.NODE_ENV === 'development' ? error : {}
            });
        }
    }
)

export default router;