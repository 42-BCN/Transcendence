'use server';

import { type UserPublicResponse } from '@/contracts/users/users.contracts';

import { cookies } from 'next/headers';
import { fetchServer } from '@/lib/http/fetcher.server';

export async function protectedMeProfileAction() {
  const cookie = (await cookies()).toString();

  const { data } = await fetchServer<UserPublicResponse>(
    '/protected/me/profile',
    'GET',
    undefined,
    {
      cookie,
    },
  );
  return data;
}
