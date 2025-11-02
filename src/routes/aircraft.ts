import express from "express";
import {getAllAircrafts, getAircraftById} from "../controllers/aircraftController";

const router = express.Router();

router.get("/", getAllAircrafts);
router.get("/:id", getAircraftById);

export default router;
