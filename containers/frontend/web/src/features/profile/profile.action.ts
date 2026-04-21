'use server';

import { type UserMeProfileResponse } from '@/contracts/api/users/users.contracts';

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
