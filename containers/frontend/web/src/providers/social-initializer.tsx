import { getCurrentUserIdOrNull } from '@/features/auth/me/get-current-user-id-or-null';
import {
  getFriendsList,
  getPendingRequests,
  getSentRequests,
} from '@/features/social/actions/social.server.actions';
import type { SocialInitialData } from '@/features/social/store/social-store.types';

export async function initializeSocialData(): Promise<SocialInitialData> {
  const userId = await getCurrentUserIdOrNull();

  if (!userId) {
    return {
      friends: [],
      pendingReceived: [],
      pendingSent: [],
      currentUserId: null,
      errors: {},
    };
  }

  const [friendsResult, pendingReceivedResult, pendingSentResult] = await Promise.all([
    getFriendsList(),
    getPendingRequests(),
    getSentRequests(),
  ]);

  return {
    friends: friendsResult.ok ? friendsResult.data.friends : [],
    pendingReceived: pendingReceivedResult.ok ? pendingReceivedResult.data.requests : [],
    pendingSent: pendingSentResult.ok ? pendingSentResult.data.requests : [],
    currentUserId: userId,
    errors: {
      friends: friendsResult.ok === false ? friendsResult.error.code : undefined,
      pendingReceived:
        pendingReceivedResult.ok === false ? pendingReceivedResult.error.code : undefined,
      pendingSent: pendingSentResult.ok === false ? pendingSentResult.error.code : undefined,
    },
  };
}
