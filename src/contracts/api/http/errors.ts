import { AUTH_ERRORS } from "../auth/auth.errors";
import { USERS_ERRORS } from "../users/users.errors";

import { HttpStatus } from "./status";
import { VALIDATION_ERROR } from "./validation";

export const RES_ERRORS = {
  // Auth module errors
  ...AUTH_ERRORS,
  ...USERS_ERRORS,
  INTERNAL_ERROR: HttpStatus.INTERNAL_SERVER_ERROR,
  // Global errors
  ...VALIDATION_ERROR,
} as const;

/* "AUTH_UNAUTHORIZED" | "AUTH_FORBIDDEN" | ... - code used for internationalization*/
export type ResErrorsName = keyof typeof RES_ERRORS;

/* 404 | 403 | 409 | ... etc */
export type ResErrorsCode = (typeof RES_ERRORS)[ResErrorsName];
