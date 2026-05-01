'use server';

import { type UserMeProfileResponse } from '@/contracts/api/users/users.contracts';

import { fetchServerAction } from '@/lib/http/fetcher.server';

export async function protectedMeProfileAction() {
  return fetchServerAction<UserMeProfileResponse>('/protected/me/profile', 'GET');
}
