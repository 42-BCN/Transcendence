export const VALIDATION = {
  REQUIRED: "REQUIRED",
  INVALID_FORMAT: "INVALID_FORMAT",
  FIELD_TOO_SHORT: "FIELD_TOO_SHORT",
  FIELD_TOO_LONG: "FIELD_TOO_LONG",
  INVALID_EMAIL: "INVALID_EMAIL",
  INVALID_USERNAME: "INVALID_USERNAME",
} as const;

export type ValidationCode = (typeof VALIDATION)[keyof typeof VALIDATION];

export type ValidationErrorDetails = {
  fields: Record<string, ValidationCode[]>;
};

export const VALIDATION_I18N_KEY: Record<ValidationCode, string> = {
  [VALIDATION.REQUIRED]: "validation.required",
  [VALIDATION.INVALID_FORMAT]: "validation.format",
  [VALIDATION.FIELD_TOO_SHORT]: "validation.tooShort",
  [VALIDATION.FIELD_TOO_LONG]: "validation.tooLong",
  [VALIDATION.INVALID_EMAIL]: "validation.invalidEmail",
  [VALIDATION.INVALID_USERNAME]: "validation.usernameFormat",
};
