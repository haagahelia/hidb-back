import {Request, Response} from "express";
import db from "../db/connection";

export const getAllAircrafts = async (req: Request, res: Response) => {
    try {
        const aircrafts = await db("Aircraft").select("*");
        res.json(aircrafts);
    } catch (err) {
        console.error(err);
        res.status(500).json({message: "Failed to fetch aircrafts"});
    }
};

export const getAircraftById = async (req: Request, res: Response) => {
    const {id} = req.params;
    try {
        const aircraft = await db("Aircraft").where({id}).first();
        if (!aircraft) return res.status(404).json({message: "Aircraft not found"});
        res.json(aircraft);
    } catch (err) {
        console.error(err);
        res.status(500).json({message: "Error fetching aircraft"});
    }
};
