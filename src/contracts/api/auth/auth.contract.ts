import type { ApiResponse } from "../http/response";
import type { ValidationErrorDetails } from "../http/validation";
import { type AuthErrorName } from "./auth.errors";

export type AuthUser = {
  id: string; // uuid
  email: string;
  username: string;
};

// ---------------------------------------
// POST /api/auth/signup
// ---------------------------------------

export type SignupOk = {
  user: AuthUser;
};

export const AUTH_SIGNUP_ERRORS = [
  "AUTH_INTERNAL_ERROR",
  "AUTH_EMAIL_ALREADY_EXISTS",
  "AUTH_EMAIL_NOT_VERIFIED",
  "VALIDATION_ERROR",
] as const satisfies readonly AuthErrorName[];

export type SignupError = (typeof AUTH_SIGNUP_ERRORS)[number];

export type SignupRes = ApiResponse<
  SignupOk,
  SignupError,
  ValidationErrorDetails
>;

// ---------------------------------------
// POST /api/auth/login
// ---------------------------------------

export type LoginOk = {
  user: AuthUser;
};

export const AUTH_LOGIN_ERRORS = [
  "AUTH_INVALID_CREDENTIALS",
  "AUTH_ACCOUNT_LOCKED",
  "AUTH_EMAIL_NOT_VERIFIED",
  "VALIDATION_ERROR",
  "AUTH_INTERNAL_ERROR",
] as const satisfies readonly AuthErrorName[];

export type LoginError = (typeof AUTH_LOGIN_ERRORS)[number];

export type LoginRes = ApiResponse<LoginOk, LoginError, ValidationErrorDetails>;

// ---------------------------------------
// POST /api/auth/logout
// ---------------------------------------

export type LogoutOk = null;

export const AUTH_LOGOUT_ERRORS = [
  "AUTH_INTERNAL_ERROR",
] as const satisfies readonly AuthErrorName[];

export type LogoutError = (typeof AUTH_LOGOUT_ERRORS)[number];

export type LogoutRes = ApiResponse<LogoutOk, LogoutError>;

// ---------------------------------------
// GET /api/auth/me
// ---------------------------------------

export type AuthMeOk = {
  user: AuthUser;
};

export const AUTH_ME_ERRORS = [
  "AUTH_UNAUTHORIZED",
  "AUTH_INTERNAL_ERROR",
] as const satisfies readonly AuthErrorName[];

export type MeError = (typeof AUTH_ME_ERRORS)[number];

export type MeRes = ApiResponse<AuthMeOk, MeError>;
