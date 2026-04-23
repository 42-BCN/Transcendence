'use server';

import { cookies } from 'next/headers';

import { fetchServer, withServerAction } from '@/lib/http/fetcher.server';
import type {
  GetFriendsListResponse,
  GetPendingRequestsResponse,
  GetSentRequestsResponse,
} from '@/contracts/api/friendships/friendships.contracts';

/**
 * Fetches the current user's accepted friends list.
 */
export async function getFriendsList() {
  const cookie = (await cookies()).toString();
  const result = await withServerAction(async () => {
    const response = await fetchServer<GetFriendsListResponse>(
      '/friends/detailed',
      'GET',
      undefined,
      {
        cookie,
      },
    );
    return response.data;
  })();
  console.log(result);
  return result;
}

/**
 * Fetches pending incoming friend requests.
 */
export async function getPendingRequests() {
  const cookie = (await cookies()).toString();
  const result = await withServerAction(async () => {
    const res = await fetchServer<GetPendingRequestsResponse>(
      '/friends/requests/pending',
      'GET',
      undefined,
      { cookie },
    );
    return res.data;
  })();
  return result;
}

/**
 * Fetches friend requests sent by the current user.
 */
export async function getSentRequests() {
  const cookie = (await cookies()).toString();
  const result = await withServerAction(async () => {
    const res = await fetchServer<GetSentRequestsResponse>(
      '/friends/requests/sent',
      'GET',
      undefined,
      { cookie },
    );
    return res.data;
  })();
  return result;
}
