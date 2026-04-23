'use client';

import type { LogoutRes } from '@/contracts/api/auth/auth.contract';
import { fetchClient } from '@/lib/http/fetcher.client';

export async function logoutAction() {
  const result = await fetchClient<LogoutRes>('/api/auth/logout', 'POST', undefined, {
    withAuth: true,
  });

  return result.data;
}
