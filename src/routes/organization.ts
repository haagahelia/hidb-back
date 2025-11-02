import express from "express";
import {getAllOrganizations, getOrganizationById} from "../controllers/organizationController";

const router = express.Router();

router.get("/", getAllOrganizations);
router.get("/:id", getOrganizationById);

export default router;
