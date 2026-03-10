import { HttpStatus } from "../http/status";
import { VALIDATION_ERROR } from "../http";

export const AUTH_ERRORS = {
  // Auth module errors
  AUTH_ACCOUNT_LOCKED: HttpStatus.FORBIDDEN,
  AUTH_UNAUTHORIZED: HttpStatus.UNAUTHORIZED,
  AUTH_FORBIDDEN: HttpStatus.FORBIDDEN,
  AUTH_INVALID_CREDENTIALS: HttpStatus.UNAUTHORIZED,
  AUTH_EMAIL_ALREADY_EXISTS: HttpStatus.CONFLICT,
  AUTH_EMAIL_NOT_VERIFIED: HttpStatus.FORBIDDEN,
  AUTH_TOKEN_EXPIRED: HttpStatus.UNAUTHORIZED,
  AUTH_CSRF_FAILED: HttpStatus.FORBIDDEN,
  AUTH_INTERNAL_ERROR: HttpStatus.INTERNAL_SERVER_ERROR,
  AUTH_GOOGLE_USER_INSERT_FAILED: HttpStatus.INTERNAL_SERVER_ERROR,
  AUTH_GOOGLE_LINK_FAILED: HttpStatus.INTERNAL_SERVER_ERROR,
  INTERNAL_ERROR: HttpStatus.INTERNAL_SERVER_ERROR,
  AUTH_ACCOUNT_NOT_FOUND: HttpStatus.NOT_FOUND, //Add to contract
  AUTH_TOO_MANY_REQUEST: HttpStatus.TOO_MANY_REQUEST, //Add to contract

  // Global errors
  ...VALIDATION_ERROR,
} as const;

/* "AUTH_UNAUTHORIZED" | "AUTH_FORBIDDEN" | ... - code used for internationalization*/
export type AuthErrorName = keyof typeof AUTH_ERRORS;

/* 404 | 403 | 409 | ... etc */
export type AuthErrorCode = (typeof AUTH_ERRORS)[AuthErrorName];
