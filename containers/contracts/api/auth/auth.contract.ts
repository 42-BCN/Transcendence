import type { ApiResponse } from '../http/response';
import type { ValidationErrorDetails } from '../http/validation';
import { type AuthErrorName } from './auth.errors';

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
  'AUTH_INTERNAL_ERROR',
  'AUTH_RATE_LIMITED',
  'VALIDATION_ERROR',
] as const satisfies readonly AuthErrorName[];

export type SignupError = (typeof AUTH_SIGNUP_ERRORS)[number];

export type SignupRes = ApiResponse<SignupOk, SignupError, ValidationErrorDetails>;

// ---------------------------------------
// POST /api/auth/login
// ---------------------------------------

export type LoginOk = {
  user: AuthUser;
};

export const AUTH_LOGIN_ERRORS = [
  'AUTH_RATE_LIMITED',
  'AUTH_INVALID_CREDENTIALS',
  'AUTH_EMAIL_NOT_VERIFIED',
  'VALIDATION_ERROR',
  'AUTH_INTERNAL_ERROR',
] as const satisfies readonly AuthErrorName[];

export type LoginError = (typeof AUTH_LOGIN_ERRORS)[number];

export type LoginRes = ApiResponse<LoginOk, LoginError, ValidationErrorDetails>;

// ---------------------------------------
// POST /api/auth/logout
// ---------------------------------------

export type LogoutOk = null;

export const AUTH_LOGOUT_ERRORS = [
  'AUTH_INTERNAL_ERROR',
] as const satisfies readonly AuthErrorName[];

export type LogoutError = (typeof AUTH_LOGOUT_ERRORS)[number];

export type LogoutRes = ApiResponse<LogoutOk, LogoutError>;

// ---------------------------------------
// POST /api/auth/resend-verification
// ---------------------------------------

export type ResendVerificationOk = null;

export const AUTH_RESEND_VERIFICATION_ERRORS = [
  'AUTH_RATE_LIMITED',
  'AUTH_RESEND_VERIFICATION_NOT_FOUND',
  'AUTH_RESEND_VERIFICATION_COOLDOWN',
  'AUTH_INTERNAL_ERROR',
  'VALIDATION_ERROR',
] as const satisfies readonly AuthErrorName[];

export type ResendVerificationError = (typeof AUTH_RESEND_VERIFICATION_ERRORS)[number];

export type ResendVerificationRes = ApiResponse<ResendVerificationOk, ResendVerificationError>;

// ---------------------------------------
// POST /api/auth/verify-email
// ---------------------------------------

export type VerifyEmailOk = null;

export const AUTH_VERIFY_EMAIL_ERRORS = [
  'AUTH_TOKEN_EXPIRED',
  'AUTH_FORBIDDEN',
  'AUTH_INTERNAL_ERROR',
  'VALIDATION_ERROR',
] as const satisfies readonly AuthErrorName[];

export type VerifyEmailError = (typeof AUTH_VERIFY_EMAIL_ERRORS)[number];

export type VerifyEmailRes = ApiResponse<VerifyEmailOk, VerifyEmailError, ValidationErrorDetails>;

// ---------------------------------------
// POST /api/auth/reset-password
// ---------------------------------------

export type ResetPasswordOk = null;

export const AUTH_RESET_PASSWORD_ERRORS = [
  'AUTH_TOKEN_EXPIRED',
  'AUTH_FORBIDDEN',
  'AUTH_INTERNAL_ERROR',
  'VALIDATION_ERROR',
] as const satisfies readonly AuthErrorName[];

export type ResetPasswordError = (typeof AUTH_RESET_PASSWORD_ERRORS)[number];

export type ResetPasswordRes = ApiResponse<
  ResetPasswordOk,
  ResetPasswordError,
  ValidationErrorDetails
>;

// ---------------------------------------
// GET /api/auth/callback/google
// ---------------------------------------

export type GoogleCallbackOk = null;

export const AUTH_GOOGLE_CALLBACK_ERRORS = [
  'AUTH_CSRF_FAILED',
  'AUTH_FORBIDDEN',
  'AUTH_INTERNAL_ERROR',
] as const satisfies readonly AuthErrorName[];

export type GoogleCallbackError = (typeof AUTH_GOOGLE_CALLBACK_ERRORS)[number];

export type GoogleCallbackRes = ApiResponse<GoogleCallbackOk, GoogleCallbackError>;

// ---------------------------------------
// GET /api/auth/me
// ---------------------------------------

export type AuthMeOk = {
  userId: string;
};

export const AUTH_ME_ERRORS = [
  'AUTH_UNAUTHORIZED',
  'AUTH_INTERNAL_ERROR',
] as const satisfies readonly AuthErrorName[];

export type MeError = (typeof AUTH_ME_ERRORS)[number];

export type MeRes = ApiResponse<AuthMeOk, MeError>;

export type RecoverOk = {
  identifier: string;
};

export const AUTH_RECOVER_ERRORS = [
  'AUTH_RATE_LIMITED',
  'AUTH_INTERNAL_ERROR',
  'VALIDATION_ERROR',
] as const satisfies readonly AuthErrorName[];

export type RecoverError = (typeof AUTH_RECOVER_ERRORS)[number];

export type RecoverRes = ApiResponse<RecoverOk, RecoverError, ValidationErrorDetails>;
