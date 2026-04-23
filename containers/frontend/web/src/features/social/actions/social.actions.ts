import { fetchClient } from '@/lib/http/fetcher.client';

import type { RespondFriendRequestResponse } from '@/contracts/api/friendships/friendships.contracts';

/**
 * Accepts or rejects a friend request.
 */
export async function respondToRequest(friendshipId: string, action: 'accept' | 'reject') {
  const response = await fetchClient<RespondFriendRequestResponse>(
    '/api/friends/respond',
    'POST',
    {
      friendshipId,
      action,
    },
    {
      withAuth: true,
    },
  );
  return response.data;
}

/**
 * Deletes a friendship or cancels a sent request.
 */
export async function deleteFriendship(friendshipId: string) {
  const response = await fetchClient<any>(`/api/friends/${friendshipId}`, 'DELETE', undefined, {
    withAuth: true,
  });
  return response.data;
}
