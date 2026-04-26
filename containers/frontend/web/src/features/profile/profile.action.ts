'use server';

import { type UserMeProfileResponse } from '@/contracts/api/users/users.contracts';

import { cookies } from 'next/headers';
import { fetchServer, withServerAction } from '@/lib/http/fetcher.server';

export async function protectedMeProfileAction() {
  const cookie = (await cookies()).toString();

  const result = await withServerAction(async () => {
    const response = await fetchServer<UserMeProfileResponse>(
      '/protected/me/profile',
      'GET',
      undefined,
      {
        cookie,
      },
    );
    return response.data;
  })();

  return result;
}
