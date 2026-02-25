import { HttpStatus } from "./status";

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

export const VALIDATION_ERROR = {
  code: "VALIDATION_ERROR",
  status: HttpStatus.UNPROCESSABLE_ENTITY,
  i18nKey: "errors.validation",
} as const;

export type ValidationCode = (typeof VALIDATION)[keyof typeof VALIDATION];

export type ValidationErrorDetails = {
  fields: Record<string, ValidationCode[]>;
};

// Will fix later
// The VALIDATION_I18N_KEY mapping has inconsistent key names that don't match the actual i18n message keys. For example, VALIDATION.REQUIRED maps to 'validation.required' in VALIDATION_I18N_KEY, but the actual i18n key in en.json is 'validation.REQUIRED'. Either update VALIDATION_I18N_KEY to match the actual keys (e.g., 'validation.REQUIRED'), or change the i18n keys to match the mapping (e.g., 'validation.required'). Since this mapping is not used in the code, consider removing it entirely or updating the code to use it.
export const VALIDATION_I18N_KEY: Record<ValidationCode, string> = {
  [VALIDATION.REQUIRED]: "validation.required",
  [VALIDATION.INVALID_FORMAT]: "validation.format",
  [VALIDATION.FIELD_TOO_SHORT]: "validation.tooShort",
  [VALIDATION.FIELD_TOO_LONG]: "validation.tooLong",
  [VALIDATION.INVALID_EMAIL]: "validation.invalidEmail",
  [VALIDATION.INVALID_USERNAME]: "validation.usernameFormat",
  [VALIDATION.PASSWORDS_DO_NOT_MATCH]: "validation.passwordsDoNotMatch",
  [VALIDATION.OUT_OF_RANGE]: "validation.outOfRange",
};
