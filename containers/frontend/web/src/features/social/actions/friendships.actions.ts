import { fetchClient } from '@/lib/http/fetcher.client';

import type {
  RespondFriendRequestResponse,
  DeleteFriendshipResponse,
} from '@/contracts/api/friendships/friendships.contracts';
import {
  RespondFriendRequestBodySchema,
  DeleteFriendshipParamSchema,
} from '@/contracts/api/friendships/friendships.validation';

/**
 * Accepts or rejects a friend request.
 */
export async function respondToRequest(friendshipId: string, action: 'accept' | 'reject') {
  const parsed = RespondFriendRequestBodySchema.safeParse({ friendshipId, action });
  if (!parsed.success) {
    return { ok: false as const, error: { code: 'VALIDATION_ERROR' } };
  }

  const response = await fetchClient<RespondFriendRequestResponse>(
    '/api/friends/respond',
    'POST',
    parsed.data,
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
  const parsed = DeleteFriendshipParamSchema.safeParse({ friendshipId });
  if (!parsed.success) {
    return { ok: false as const, error: { code: 'VALIDATION_ERROR' } };
  }

  const response = await fetchClient<DeleteFriendshipResponse>(
    `/api/friends/${parsed.data.friendshipId}`,
    'DELETE',
    undefined,
    {
      withAuth: true,
    },
  );
  return response.data;
}
