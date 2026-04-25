import { fetchClient } from '@/lib/http/fetcher.client';
import type { SearchUsersResponse } from '@/contracts/api/users/users.contracts';
import { SearchUsersQuerySchema } from '@/contracts/api/users/users.validation';

/**
 * Searches for users by username.
 */
export async function searchUsers(query: string, limit: number = 20) {
  const parsed = SearchUsersQuerySchema.safeParse({ q: query, limit });
  if (!parsed.success) {
    return { ok: false as const, error: { code: 'VALIDATION_ERROR' } };
  }

  const response = await fetchClient<SearchUsersResponse>(
    `/api/users/search?q=${encodeURIComponent(parsed.data.q)}&limit=${parsed.data.limit}`,
    'GET',
    undefined,
    {
      withAuth: true,
    },
  );
  return response.data;
}
