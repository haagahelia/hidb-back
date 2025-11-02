import {Request, Response} from "express";
import db from "../db/connection";

export const getAllOrganizations = async (req: Request, res: Response) => {
    try {
        const organizations = await db("Organization").select("*");
        res.json(organizations);
    } catch (err) {
        console.error(err);
        res.status(500).json({message: "Failed to fetch organizations"});
    }
};

export const getOrganizationById = async (req: Request, res: Response) => {
    const {id} = req.params;
    try {
        const organization = await db("Organization").where({id}).first();
        if (!organization) return res.status(404).json({message: "Organization not found"});
        res.json(organization);
    } catch (err) {
        console.error(err);
        res.status(500).json({message: "Error fetching organization"});
    }
};