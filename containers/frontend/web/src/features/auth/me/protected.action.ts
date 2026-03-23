'use server';

import type { MeRes } from '@/contracts/auth/auth.contract';
import { cookies } from 'next/headers';
import { fetchServer } from '@/lib/http/fetcher.server';

export async function protectedMeAction() {
  const cookie = (await cookies()).toString();

  const { data } = await fetchServer<MeRes>('/protected/me', 'GET', undefined, { cookie });
  return data;
}
