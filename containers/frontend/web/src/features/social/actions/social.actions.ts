import { fetchClient } from '@/lib/http/fetcher.client';
import type {
  GetFriendsListResponse,
  GetPendingRequestsResponse,
  GetSentRequestsResponse,
  RespondFriendRequestResponse,
} from '@/contracts/api/friendships/friendships.contracts';

/**
 * Fetches the current user's accepted friends list.
 */
export async function getFriendsList() {
  const response = await fetchClient<GetFriendsListResponse>('/api/friends', 'GET', undefined, {
    withAuth: true,
  });
  return response.data;
}

/**
 * Fetches pending incoming friend requests.
 */
export async function getPendingRequests() {
  const response = await fetchClient<GetPendingRequestsResponse>(
    '/api/friends/requests/pending',
    'GET',
    undefined,
    { withAuth: true },
  );
  return response.data;
}

/**
 * Fetches friend requests sent by the current user.
 */
export async function getSentRequests() {
  const response = await fetchClient<GetSentRequestsResponse>(
    '/api/friends/requests/sent',
    'GET',
    undefined,
    { withAuth: true },
  );
  return response.data;
}

/**
 * Accepts or rejects a friend request.
 */
export async function respondToRequest(friendshipId: string, action: 'accept' | 'reject') {
  const response = await fetchClient<RespondFriendRequestResponse>(
    '/api/friends/respond',
    'POST',
    { friendshipId, action },
    { withAuth: true },
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
