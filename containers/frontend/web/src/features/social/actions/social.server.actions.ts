'use server';

import { fetchServerAction } from '@/lib/http/fetcher.server';
import type {
  GetFriendsListResponse,
  GetPendingRequestsResponse,
  GetSentRequestsResponse,
} from '@/contracts/api/friendships/friendships.contracts';

/**
 * Fetches the current user's accepted friends list.
 */
export async function getFriendsList() {
  return fetchServerAction<GetFriendsListResponse>('/friends', 'GET');
}

/**
 * Fetches pending incoming friend requests.
 */
export async function getPendingRequests() {
  return fetchServerAction<GetPendingRequestsResponse>('/friends/requests/pending', 'GET');
}

/**
 * Fetches friend requests sent by the current user.
 */
export async function getSentRequests() {
  return fetchServerAction<GetSentRequestsResponse>('/friends/requests/sent', 'GET');
}
