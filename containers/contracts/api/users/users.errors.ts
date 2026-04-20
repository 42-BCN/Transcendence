import { HttpStatus } from '../http/status';
import { VALIDATION_ERROR } from '../http';

export const USERS_ERRORS = {
  INTERNAL_ERROR: HttpStatus.INTERNAL_SERVER_ERROR,
  USER_NOT_FOUND: HttpStatus.NOT_FOUND,
  AUTH_UNAUTHORIZED: HttpStatus.UNAUTHORIZED,
  AUTH_RATE_LIMITED: HttpStatus.TOO_MANY_REQUESTS,
  ...VALIDATION_ERROR,
} as const;

export type UsersErrorName = keyof typeof USERS_ERRORS;
export type UsersErrorCode = (typeof USERS_ERRORS)[UsersErrorName];

export const SEARCH_USERS_ERRORS = [
  'INTERNAL_ERROR',
  'VALIDATION_ERROR',
  'AUTH_UNAUTHORIZED',
  'AUTH_RATE_LIMITED',
] as const satisfies readonly UsersErrorName[];

export type SearchUsersErrorName = (typeof SEARCH_USERS_ERRORS)[number];
