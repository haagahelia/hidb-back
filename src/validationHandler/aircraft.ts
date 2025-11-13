import { createIdValidatorChain } from ".";

export const validateAircraftId = [...createIdValidatorChain('id')];
