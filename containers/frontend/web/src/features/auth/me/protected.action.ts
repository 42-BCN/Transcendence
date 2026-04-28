'use server';

import { cookies } from 'next/headers';
import type { MeRes } from '@/contracts/api/auth/auth.contract';
import { fetchServer, withServerAction } from '@/lib/http/fetcher.server';

export async function protectedMeAction() {
  const cookie = (await cookies()).toString();

  const result = await withServerAction(async () => {
    const res = await fetchServer<MeRes>('/protected/me', 'GET', undefined, {
      cookie,
    });
    return res.data;
  })();
  return result;
}
