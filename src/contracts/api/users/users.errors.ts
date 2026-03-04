import { HttpStatus } from "../http/status";
import { VALIDATION_ERROR } from "../http";

export const USERS_ERRORS = {
  INTERNAL_ERROR: HttpStatus.INTERNAL_SERVER_ERROR,
  VALIDATION_ERROR,
} as const;

export type UsersErrorName = keyof typeof USERS_ERRORS;
export type UsersErrorCode = (typeof USERS_ERRORS)[UsersErrorName];
