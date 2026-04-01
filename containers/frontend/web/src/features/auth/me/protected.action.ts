'use server';

import { cookies } from 'next/headers';
import type { MeRes } from '@/contracts/api/auth/auth.contract';
import type { ApiResponse } from '@/contracts/api/http';
import { fetchServer } from '@/lib/http/fetcher.server';

export async function protectedMeAction() {
  const cookie = (await cookies()).toString();

  const { data } = await fetchServer<ApiResponse<MeRes>>('/protected/me', 'GET', undefined, {
    cookie,
  });
  return data.ok;
}
