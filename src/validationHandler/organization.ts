import { createIdValidatorChain } from ".";

export const validateOrganizationId = [...createIdValidatorChain('id')];
