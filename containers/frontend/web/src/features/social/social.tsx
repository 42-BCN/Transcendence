import { getCurrentUserIdOrNull } from '@/features/auth/me/get-current-user-id-or-null';

import {
  getFriendsList,
  getPendingRequests,
  getSentRequests,
} from './actions/social.server.actions';
import { SocialDashboard } from './social-dashboard';
import type { SocialInitialData } from './store/social-store.types';

export async function Social() {
  const userId = await getCurrentUserIdOrNull();

  if (!userId) return null;

  const [friendsResult, pendingReceivedResult, pendingSentResult] = await Promise.all([
    getFriendsList(),
    getPendingRequests(),
    getSentRequests(),
  ]);

  const initialData: SocialInitialData = {
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

  return <SocialDashboard initialData={initialData} />;
}
