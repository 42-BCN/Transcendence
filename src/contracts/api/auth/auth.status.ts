import { AUTH_ERRORS, type AuthErrorCode } from "./auth.errors";
import { HttpStatus } from "../http/status";

/**
 * Maps auth error codes to HTTP status codes.
 * Single source of truth.
 */
export const AUTH_ERROR_STATUS: Record<AuthErrorCode, number> = {
  [AUTH_ERRORS.UNAUTHORIZED]: HttpStatus.UNAUTHORIZED,
  [AUTH_ERRORS.FORBIDDEN]: HttpStatus.FORBIDDEN,
  [AUTH_ERRORS.INVALID_CREDENTIALS]: HttpStatus.UNAUTHORIZED,
  [AUTH_ERRORS.ACCOUNT_LOCKED]: HttpStatus.FORBIDDEN,
  [AUTH_ERRORS.EMAIL_ALREADY_EXISTS]: HttpStatus.CONFLICT,
  [AUTH_ERRORS.EMAIL_NOT_VERIFIED]: HttpStatus.FORBIDDEN,
  [AUTH_ERRORS.TOKEN_EXPIRED]: HttpStatus.UNAUTHORIZED,
  [AUTH_ERRORS.CSRF_FAILED]: HttpStatus.FORBIDDEN,
  [AUTH_ERRORS.VALIDATION_ERROR]: HttpStatus.UNPROCESSABLE_ENTITY,
  [AUTH_ERRORS.INTERNAL_ERROR]: HttpStatus.INTERNAL_SERVER_ERROR,
};
