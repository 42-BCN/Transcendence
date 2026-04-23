'use client';

import type { LogoutRes } from '@/contracts/api/auth/auth.contract';
import { fetchClient } from '@/lib/http/fetcher.client';

export async function logoutAction() {
  try {
    const result = await fetchClient<LogoutRes>('/api/auth/logout', 'POST', undefined, {
      withAuth: true,
    });

    return result.data;
  } catch {
    return { ok: false, error: { code: 'AUTH_INTERNAL_ERROR' } };
  }
}
