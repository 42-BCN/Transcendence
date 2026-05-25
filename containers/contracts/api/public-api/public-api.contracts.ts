import type { ApiResponse } from '../http/response';
import type { ValidationErrorDetails } from '../http/validation';
import type { UserPublic } from '../users/users.contracts';
import type { UsersErrorName } from '../users/users.errors';

export type PublicApiHealthOk = {
  database: 'up';
  redis: 'up';
};

export type PublicApiHealthResponse = ApiResponse<PublicApiHealthOk, 'INTERNAL_ERROR'>;

export type PublicUsersCountOk = {
  totalUsers: number;
};

export type PublicUsersCountResponse = ApiResponse<PublicUsersCountOk, 'INTERNAL_ERROR'>;

export type PublicUsersSearchOk = {
  users: UserPublic[];
  meta: {
    q: string;
    limit: number;
    count: number;
  };
};

export const PUBLIC_USERS_SEARCH_ERRORS = [
  'INTERNAL_ERROR',
  'VALIDATION_ERROR',
  'AUTH_UNAUTHORIZED',
  'AUTH_RATE_LIMITED',
] as const satisfies readonly UsersErrorName[];

export type PublicUsersSearchError = (typeof PUBLIC_USERS_SEARCH_ERRORS)[number];

export type PublicUsersSearchResponse = ApiResponse<
  PublicUsersSearchOk,
  PublicUsersSearchError,
  ValidationErrorDetails
>;
