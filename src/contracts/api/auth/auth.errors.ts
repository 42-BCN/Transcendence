export const AUTH_ERRORS = {
  UNAUTHORIZED: "AUTH_UNAUTHORIZED",
  FORBIDDEN: "AUTH_FORBIDDEN",
  INVALID_CREDENTIALS: "AUTH_INVALID_CREDENTIALS",
  ACCOUNT_LOCKED: "AUTH_ACCOUNT_LOCKED",
  EMAIL_ALREADY_EXISTS: "AUTH_EMAIL_ALREADY_EXISTS",
  EMAIL_NOT_VERIFIED: "AUTH_EMAIL_NOT_VERIFIED",
  TOKEN_EXPIRED: "AUTH_TOKEN_EXPIRED",
  CSRF_FAILED: "AUTH_CSRF_FAILED",
  VALIDATION_ERROR: "AUTH_VALIDATION_ERROR",
  INTERNAL_ERROR: "AUTH_INTERNAL_ERROR",
} as const;

export type AuthErrorCode = (typeof AUTH_ERRORS)[keyof typeof AUTH_ERRORS];

// FE mapping: backend error code -> i18n key
export const AUTH_ERROR_I18N_KEY: Record<AuthErrorCode, string> = {
  [AUTH_ERRORS.UNAUTHORIZED]: "auth.errors.unauthorized",
  [AUTH_ERRORS.FORBIDDEN]: "auth.errors.forbidden",
  [AUTH_ERRORS.INVALID_CREDENTIALS]: "auth.errors.invalidCredentials",
  [AUTH_ERRORS.ACCOUNT_LOCKED]: "auth.errors.accountLocked",
  [AUTH_ERRORS.EMAIL_ALREADY_EXISTS]: "auth.errors.emailAlreadyExists",
  [AUTH_ERRORS.EMAIL_NOT_VERIFIED]: "auth.errors.emailNotVerified",
  [AUTH_ERRORS.TOKEN_EXPIRED]: "auth.errors.tokenExpired",
  [AUTH_ERRORS.CSRF_FAILED]: "auth.errors.csrfFailed",
  [AUTH_ERRORS.VALIDATION_ERROR]: "auth.errors.validation",
  [AUTH_ERRORS.INTERNAL_ERROR]: "auth.errors.internal",
};
