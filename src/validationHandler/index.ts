import { NextFunction, Request, Response } from 'express';

import {
  Result,
  ValidationChain,
  ValidationError,
  body,
  param,
  query,
  check,
  validationResult,
} from 'express-validator';
import { validationErrorHandler } from '../responseHandler';

export const validateRequest = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const errors: Result<ValidationError> = validationResult(req);
    if (!errors.isEmpty()) {
        return validationErrorHandler(req, res, errors);
    }
    next();
};



// Common validator chain objects for: id, name, description, priority
export const createIdValidatorChain = (
  fieldName: string,
  location: 'param' | 'body' | 'query' = 'param'
): ValidationChain[] => {
  const validator = location === 'param' ? param(fieldName) :
                   location === 'body' ? body(fieldName) :
                   query(fieldName);

  return [
    validator
      .custom((value) => {
        // First: Check if empty/undefined/null
        if (!value || value.toString().trim() === '') {
          throw new Error(`${fieldName} is required`);
        }
        
        const stringValue = value.toString().trim();
        
        // Second: Check if it's a valid integer pattern (no decimals)
        if (!/^[0-9]+$/.test(stringValue)) {
          // This catches decimals (1.5), negative numbers (-1), and non-numbers (abc)
          throw new Error(`${fieldName} must be a positive integer`);
        }
        
        // Third: Parse and check if positive
        const num = parseInt(stringValue, 10);
        if (num <= 0) {
          throw new Error(`${fieldName} must be a positive integer`);
        }
        
        return true;
      })
  ];
};

export const createNumberValidatorChain = (
  fieldName: string,
): ValidationChain[] => [
  check(`${fieldName}`)
    .matches(/^[0-9]+$/)
    .withMessage(`${fieldName} must be a number`)
    .bail()
    .notEmpty()
    .withMessage('Cannot be Empty')
    .bail(),
];

export const createFloatValidatorChain = (
  fieldName: string,
): ValidationChain[] => [
  body(`${fieldName}`)
    .matches(/^[0-9]*(.[0-9]{1,2})?$/)
    .withMessage('Must be a number')
    .bail()
    .isFloat()
    .notEmpty()
    .withMessage('Cannot be empty')
    .bail(),
];

export const validateIdObl = [...createIdValidatorChain('id')];

export { validationErrorHandler };
