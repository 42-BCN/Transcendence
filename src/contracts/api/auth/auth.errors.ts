import { HttpStatus } from "../http/status";
import { VALIDATION_ERROR } from "../http";

export const AUTH_ERROR_DEFS = {
  UNAUTHORIZED: {
    code: "AUTH_UNAUTHORIZED",
    status: HttpStatus.UNAUTHORIZED,
    i18nKey: "auth.errors.unauthorized",
  },
  FORBIDDEN: {
    code: "AUTH_FORBIDDEN",
    status: HttpStatus.FORBIDDEN,
    i18nKey: "auth.errors.forbidden",
  },
  INVALID_CREDENTIALS: {
    code: "AUTH_INVALID_CREDENTIALS",
    status: HttpStatus.UNAUTHORIZED,
    i18nKey: "auth.errors.invalidCredentials",
  },
  ACCOUNT_LOCKED: {
    code: "AUTH_ACCOUNT_LOCKED",
    status: HttpStatus.FORBIDDEN,
    i18nKey: "auth.errors.accountLocked",
  },
  EMAIL_ALREADY_EXISTS: {
    code: "AUTH_EMAIL_ALREADY_EXISTS",
    status: HttpStatus.CONFLICT,
    i18nKey: "auth.errors.emailAlreadyExists",
  },
  EMAIL_NOT_VERIFIED: {
    code: "AUTH_EMAIL_NOT_VERIFIED",
    status: HttpStatus.FORBIDDEN,
    i18nKey: "auth.errors.emailNotVerified",
  },
  TOKEN_EXPIRED: {
    code: "AUTH_TOKEN_EXPIRED",
    status: HttpStatus.UNAUTHORIZED,
    i18nKey: "auth.errors.tokenExpired",
  },
  CSRF_FAILED: {
    code: "AUTH_CSRF_FAILED",
    status: HttpStatus.FORBIDDEN,
    i18nKey: "auth.errors.csrfFailed",
  },
  INTERNAL_ERROR: {
    code: "AUTH_INTERNAL_ERROR",
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    i18nKey: "auth.errors.internal",
  },
  VALIDATION_ERROR,
} as const;

export const AUTH_ERRORS = Object.fromEntries(
  Object.entries(AUTH_ERROR_DEFS).map(([name, def]) => [name, def.code]),
) as { [K in AuthErrorName]: (typeof AUTH_ERROR_DEFS)[K]["code"] };

export const AUTH_ERROR_STATUS = Object.fromEntries(
  Object.values(AUTH_ERROR_DEFS).map((def) => [def.code, def.status]),
) as Record<AuthErrorCode, number>;

export const AUTH_ERROR_I18N_KEY = Object.fromEntries(
  Object.values(AUTH_ERROR_DEFS).map((def) => [def.code, def.i18nKey]),
) as Record<AuthErrorCode, string>;

export type AuthErrorName = keyof typeof AUTH_ERROR_DEFS;
export type AuthErrorCode = (typeof AUTH_ERROR_DEFS)[AuthErrorName]["code"];
