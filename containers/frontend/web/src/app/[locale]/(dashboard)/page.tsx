import {
  getFriendsList,
  getPendingRequests,
  getSentRequests,
} from '@/features/social/actions/social.server.actions';
import { SocialDashboard } from '@/features/social/social-dashboard';
import { protectedMeProfileAction } from '@/features/profile/profile.action';

export default async function HomePage() {
  const [f, r, s, me] = await Promise.all([
    getFriendsList(),
    getPendingRequests(),
    getSentRequests(),
    protectedMeProfileAction(),
  ]);

  const initialData = {
    friends: f.ok ? f.data.friends : [],
    pendingReceived: r.ok ? r.data.requests : [],
    pendingSent: s.ok ? s.data.requests : [],
    currentUserId: me.ok ? me.data.id : undefined,
    errors: {
      friends: f.ok === false ? f.error.code : undefined,
      pendingReceived: r.ok === false ? r.error.code : undefined,
      pendingSent: s.ok === false ? s.error.code : undefined,
    },
  };

  return <SocialDashboard initialData={initialData} />;
}
