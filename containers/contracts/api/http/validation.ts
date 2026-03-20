import { HttpStatus } from "./status";

// ERRORS DETAILS THROW BY ZOD HERE
export const VALIDATION = {
  REQUIRED: "REQUIRED",
  INVALID_FORMAT: "INVALID_FORMAT",
  FIELD_TOO_SHORT: "FIELD_TOO_SHORT",
  FIELD_TOO_LONG: "FIELD_TOO_LONG",
  INVALID_EMAIL: "INVALID_EMAIL",
  INVALID_USERNAME: "INVALID_USERNAME",
  PASSWORDS_DO_NOT_MATCH: "PASSWORDS_DO_NOT_MATCH",
  OUT_OF_RANGE: "OUT_OF_RANGE",
} as const;

// FORMAT GENERAL ERRORS
export const VALIDATION_ERROR = {
  VALIDATION_ERROR: HttpStatus.UNPROCESSABLE_ENTITY,
};

export type ValidationCode = (typeof VALIDATION)[keyof typeof VALIDATION];

export type ValidationErrorDetails = {
  fields: Record<string, ValidationCode[]>;
};
