import type { ApiResponse } from "../http/response";
import type { ValidationErrorDetails } from "../http/validation";
import { AUTH_ERRORS } from "./auth.errors";
import { AuthLoginRequestSchema } from "./auth.validation";
import type { z } from "zod";

export type AuthUser = {
  id: string; // uuid
  email: string;
  username: string;
};

// ---------------------------------------
// POST /api/auth/login
// ---------------------------------------

export type AuthLoginRequest = z.infer<typeof AuthLoginRequestSchema>;

// --------------------------------------------------- Response

export type AuthLoginOk = {
  user: AuthUser;
};

export const AUTH_LOGIN_ERRORS = [
  AUTH_ERRORS.INVALID_CREDENTIALS,
  AUTH_ERRORS.ACCOUNT_LOCKED,
  AUTH_ERRORS.EMAIL_NOT_VERIFIED,
  AUTH_ERRORS.VALIDATION_ERROR,
  AUTH_ERRORS.INTERNAL_ERROR,
] as const;

export type AuthLoginError = (typeof AUTH_LOGIN_ERRORS)[number];

export type AuthLoginResponse = ApiResponse<
  AuthLoginOk,
  AuthLoginError,
  ValidationErrorDetails
>;

// ---------------------------------------
// POST /api/auth/logout
// ---------------------------------------

// No request body
// --------------------------------------------------- Response
export type AuthLogoutOk = null;

export const AUTH_LOGOUT_ERRORS = [AUTH_ERRORS.INTERNAL_ERROR] as const;

export type AuthLogoutError = (typeof AUTH_LOGOUT_ERRORS)[number];

export type AuthLogoutResponse = ApiResponse<AuthLogoutOk, AuthLogoutError>;

// ---------------------------------------
// GET /api/auth/me
// ---------------------------------------

// No request body
// --------------------------------------------------- Response
export type AuthMeOk = {
  user: AuthUser;
};

export const AUTH_ME_ERRORS = [
  AUTH_ERRORS.UNAUTHORIZED,
  AUTH_ERRORS.INTERNAL_ERROR,
] as const;

export type AuthMeError = (typeof AUTH_ME_ERRORS)[number];

export type AuthMeResponse = ApiResponse<AuthMeOk, AuthMeError>;
