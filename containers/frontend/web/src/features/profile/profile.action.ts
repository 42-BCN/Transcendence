'use server';

import {
  type UserMeProfileResponse,
  type UserPublicResponse,
} from '@/contracts/api/users/users.contracts';

import { cookies } from 'next/headers';
import { fetchServer } from '@/lib/http/fetcher.server';

export async function protectedMeProfileAction() {
  const cookie = (await cookies()).toString();

  const { data } = await fetchServer<UserMeProfileResponse>(
    '/protected/me/profile',
    'GET',
    undefined,
    {
      cookie,
    },
  );
  return data;
}
export async function getPublicProfileAction(userId: string) {
  const cookie = (await cookies()).toString();

  const { data } = await fetchServer<UserPublicResponse>(
    `/users/${userId}`,
    'GET',
    undefined,
    {
      cookie,
    },
  );
  return data;
}
