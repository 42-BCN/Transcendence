import { HttpStatus } from "../http/status";
import { VALIDATION_ERROR } from "../http";

export const USERS_ERROR_DEFS = {
  INTERNAL_ERROR: {
    code: "INTERNAL_ERROR",
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    i18nKey: "errors.internal",
  },
  VALIDATION_ERROR,
} as const;

export const USERS_ERRORS = Object.fromEntries(
  Object.entries(USERS_ERROR_DEFS).map(([name, def]) => [name, def.code]),
) as { [K in AuthErrorName]: (typeof USERS_ERROR_DEFS)[K]["code"] };

export const USERS_ERROR_STATUS = Object.fromEntries(
  Object.values(USERS_ERROR_DEFS).map((def) => [def.code, def.status]),
) as Record<AuthErrorCode, number>;

export const USERS_ERROR_I18N_KEY = Object.fromEntries(
  Object.values(USERS_ERROR_DEFS).map((def) => [def.code, def.i18nKey]),
) as Record<AuthErrorCode, string>;

export type AuthErrorName = keyof typeof USERS_ERROR_DEFS;
export type AuthErrorCode = (typeof USERS_ERROR_DEFS)[AuthErrorName]["code"];
