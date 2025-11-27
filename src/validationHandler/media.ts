import { createIdValidatorChain } from ".";

export const validateMediaId = [...createIdValidatorChain('id')];
