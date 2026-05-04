'use server';

import {
  type UserMeProfileResponse,
  type UserPublicResponse,
} from '@/contracts/api/users/users.contracts';

import { fetchServerAction } from '@/lib/http/fetcher.server';

/**
 * Fetches the private profile of the current user (Me).
 */
export async function protectedMeProfileAction() {
  return fetchServerAction<UserMeProfileResponse>('/protected/me/profile', 'GET');
}

/**
 * Fetches the public profile of another user by their username.
 * Required for "Other Profile" functionality.
 */
export async function getPublicProfileAction(username: string) {
  return fetchServerAction<UserPublicResponse>(
    `/users/username/${username}`,
    'GET'
  );
}
