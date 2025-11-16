import {Router, Request, Response} from "express";
import aircraftService from "../services/AircraftService";
import { validateRequest } from "../validationHandler/index";
import { validateAircraftId } from "../validationHandler/aircraft";
const router = Router();

// GET /aircraft/:id - Get specific aircraft by ID
router.get("/aircraft/:id",
    validateAircraftId,
    validateRequest,
    async (req: Request, res: Response) => {
    try {
        const aircraftId = parseInt(req.params.id);
        if (isNaN(aircraftId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid aircraft ID"
            });
        }
        
        const aircraft = await aircraftService.getAircraftById(aircraftId);
        
        if (!aircraft) {
            return res.status(404).json({
                success: false,
                message: "Aircraft not found"
            });
        }
        
        res.status(200).json({
            success: true,
            message: "Aircraft retrieved successfully",
            data: aircraft
        });
        
    } catch (error) {
        console.error('Error fetching aircraft:', error);
        res.status(500).json({
            success: false,
            message: "Error retrieving aircraft from database",
            error: process.env.NODE_ENV === 'development' ? error : {}
        });
    }
});

// GET /aircraft - Get all aircraft from database
router.get("/aircraft",
    validateRequest,
    async (req: Request, res: Response) => {
    try {
        const aircraft = await aircraftService.getAllAircraft();
        
        res.status(200).json({
            success: true,
            message: "Aircraft retrieved successfully",
            data: aircraft,
            count: aircraft.length
        });
        
    } catch (error) {
        console.error('Error fetching aircraft:', error);
        res.status(500).json({
            success: false,
            message: "Error retrieving aircraft from database",
            error: process.env.NODE_ENV === 'development' ? error : {}
        });
    }
});

export default router;