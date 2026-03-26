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
  userId: string;
};

export const AUTH_ME_ERRORS = [
  "AUTH_UNAUTHORIZED",
  "AUTH_INTERNAL_ERROR",
] as const satisfies readonly AuthErrorName[];

export type MeError = (typeof AUTH_ME_ERRORS)[number];

export type MeRes = ApiResponse<AuthMeOk, MeError>;

// ---------------------------------------
// POST /api/auth/recover
// ---------------------------------------

export type RecoverOk = null;

export const AUTH_RECOVER_ERRORS = [
  "AUTH_INTERNAL_ERROR",
  "AUTH_ACCOUNT_NOT_FOUND",
  "AUTH_ACCOUNT_LOCKED",
  "AUTH_TOO_MANY_REQUEST",
] as const satisfies readonly AuthErrorName[];

export type RecoverError = (typeof AUTH_RECOVER_ERRORS)[number];

export type RecoverRes = ApiResponse<RecoverOk, RecoverError>;

// ---------------------------------------
// POST /api/auth/recover/resend
// ---------------------------------------

export type RecoverResendOk = null;

export const AUTH_RECOVER_RESEND_ERROR = [
  "AUTH_INTERNAL_ERROR",
  "AUTH_INVALID_CREDENTIALS",
  "AUTH_TOO_MANY_REQUEST",
  "AUTH_TOKEN_EXPIRED",
  "AUTH_UNAUTHORIZED",
] as const satisfies readonly AuthErrorName[];

export type RecoverResendError = (typeof AUTH_RECOVER_RESEND_ERROR)[number];

export type RecoverResendRes = ApiResponse<RecoverResendOk, RecoverResendError>;
