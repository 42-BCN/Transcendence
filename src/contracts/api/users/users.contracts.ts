import type { ApiResponse } from "../http/response";
import type { ValidationErrorDetails } from "../http/validation";
import { USERS_ERRORS } from "./users.errors"; // create this like auth.errors

export type UserPublic = {
  id: string; // uuid
  username: string;
};

// ---------------------------------------
// GET /api/users?limit=20&offset=0
// ---------------------------------------

// --------------------------------------------------- Request
export type UsersListRequest = {
  limit?: number; // default 20, min 1, max 100
  offset?: number; // default 0, min 0
};

// --------------------------------------------------- Response
export type UsersListOk = {
  users: UserPublic[];
  meta: {
    limit: number;
    offset: number;
    count: number; // number returned in this page
  };
};

export const USERS_LIST_ERRORS = [
  USERS_ERRORS.INTERNAL_ERROR,
  USERS_ERRORS.VALIDATION_ERROR,
] as const;

export type UsersListError = (typeof USERS_LIST_ERRORS)[number];

export type UsersListResponse = ApiResponse<
  UsersListOk,
  UsersListError,
  ValidationErrorDetails
>;
