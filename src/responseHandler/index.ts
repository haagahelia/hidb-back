import dotenv from 'dotenv';
import { Request, Response } from 'express';
import { Result, ValidationError } from 'express-validator';
dotenv.config();

export const validationErrorHandler = (
    req: Request,
    res: Response,
    errors: Result<ValidationError>
) => {
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
};



