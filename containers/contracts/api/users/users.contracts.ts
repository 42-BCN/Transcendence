import type { ApiResponse } from '../http/response';
import type { ValidationErrorDetails } from '../http/validation';
import type { UsersErrorName } from './users.errors'; // create this like auth.errors

export type UserPublic = {
  id: string; // uuid zod can check for it on validation
  username: string;
};

// ---------------------------------------
// GET /api/users?limit=20&offset=0
// ---------------------------------------

export type UsersListRequest = {
  limit?: number; // default 20, min 1, max 100
  offset?: number; // default 0, min 0
};

export type UsersListOk = {
  users: UserPublic[];
  meta: {
    limit: number;
    offset: number;
    count: number; // number returned in this page
  };
};

export const USERS_LIST_ERRORS = [
  'INTERNAL_ERROR',
  'VALIDATION_ERROR',
] as const satisfies readonly UsersErrorName[];

export type UsersListError = (typeof USERS_LIST_ERRORS)[number];

export type UsersListResponse = ApiResponse<UsersListOk, UsersListError, ValidationErrorDetails>;

export type SearchUsersOk = {
  users: UserPublic[];
};

export type SearchUsersResponse = ApiResponse<SearchUsersOk, 'VALIDATION_ERROR', ValidationErrorDetails>;

export type UserPublicResponse = ApiResponse<UserPublic, UsersListError, ValidationErrorDetails>;
