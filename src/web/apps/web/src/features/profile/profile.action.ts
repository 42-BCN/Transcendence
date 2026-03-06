'use server';

import type { AuthUser } from '@/contracts/auth/auth.contract';
import { cookies } from 'next/headers';
import { fetchServer } from '@/lib/http/fetcher.server';

export async function protectedMeProfileAction() {
  const cookie = (await cookies()).toString();

  const { data } = await fetchServer<AuthUser>('/protected/me/profile', 'GET', undefined, {
    cookie,
  });
  return data;
}
