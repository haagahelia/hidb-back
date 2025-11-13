import {Router, Request, Response} from "express";
import organizationService from "../services/OrganizationService";
import {validateOrganizationId} from "../validationHandler/organization";
import { validateRequest } from "../validationHandler";

const router = Router();
// GET /organizations/:id - Get specific organization by ID
router.get("/organizations/:id",
    validateOrganizationId,
    validateRequest,
    async (req: Request, res: Response) => {
    try {
        const organizationId = parseInt(req.params.id);

        if (isNaN(organizationId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid organization ID",
            });
        }

        const organization = await organizationService.getOrganizationById(organizationId);

        if (!organization) {
            return res.status(404).json({
                success: false,
                message: "Organization not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Organization retrieved successfully",
            data: organization,
        });
    } catch (error) {
        console.error("Error fetching organization:", error);
        res.status(500).json({
            success: false,
            message: "Error retrieving organization from database",
            error: process.env.NODE_ENV === "development" ? error : {},
        });
    }
});

// GET /organizations - Get all organizations from database
router.get("/organizations", async (req: Request, res: Response) => {
    try {
        const organizations = await organizationService.getAllOrganizations();

        res.status(200).json({
            success: true,
            message: "Organizations retrieved successfully",
            data: organizations,
            count: organizations.length,
        });
    } catch (error) {
        console.error("Error fetching organizations:", error);
        res.status(500).json({
            success: false,
            message: "Error retrieving organizations from database",
            error: process.env.NODE_ENV === "development" ? error : {},
        });
    }
});

export default router;
