'use server';

import { fetchServerAction } from '@/lib/http/fetcher.server';
import type {
  GetFriendshipsResponse,
  GetPendingRequestsResponse,
  GetSentRequestsResponse,
} from '@/contracts/api/friendships/friendships.contracts';

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

/**
 * Fetches the current user's detailed friendships (includes IDs and status).
 */
export async function getDetailedFriendships() {
  return fetchServerAction<GetFriendshipsResponse>('/friends/detailed', 'GET');
}
