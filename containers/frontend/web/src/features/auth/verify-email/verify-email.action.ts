'use server';

import type { VerifyEmailRes } from '@/contracts/api/auth/auth.contract';
import { fetchServer, withServerAction } from '@/lib/http/fetcher.server';

export async function verifyEmailAction(token: string) {
  const result = await withServerAction(async () => {
    const res = await fetchServer<VerifyEmailRes>('/auth/verify-email', 'POST', { token });
    return res.data;
  })();

  return result;
}
