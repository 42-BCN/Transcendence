import { fetchClient } from '@/lib/http/fetcher.client';
import type { SearchUsersResponse } from '@/contracts/api/users/users.contracts';
import { SearchUsersQuerySchema } from '@/contracts/api/users/users.validation';

/**
 * Searches for users by username.
 */
export async function searchUsers(query: string, limit: number = 20, offset: number = 0) {
  const parsed = SearchUsersQuerySchema.safeParse({
    q: query,
    limit: String(limit),
    offset: String(offset),
  });
  if (!parsed.success) {
    return { ok: false as const, error: { code: 'VALIDATION_ERROR' } };
  }

  const { q, limit: pLimit, offset: pOffset } = parsed.data;

  const response = await fetchClient<SearchUsersResponse>(
    `/api/users/search?q=${encodeURIComponent(q)}&limit=${pLimit}&offset=${pOffset}`,
    'GET',
    undefined,
    {
      withAuth: true,
    },
  );
  if (!response.data.ok) return response.data;

  return response.data;
}
