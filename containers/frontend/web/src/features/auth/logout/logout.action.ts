'use client';

import type { ApiResponse } from '@/contracts/api/http';
import { fetchClient } from '@/lib/http/fetcher.client';

export async function logoutAction() {
  const response = await fetchClient<ApiResponse<undefined>>(
    '/api/auth/logout',
    'POST',
    undefined,
    { withAuth: true },
  );

  return response;
}
