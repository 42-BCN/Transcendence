import {
  getFriendsList,
  getPendingRequests,
  getSentRequests,
} from '@/features/social/actions/social.server.actions';
import { SocialDashboard } from '@/features/social/social-dashboard';

export default async function HomePage() {
  const [f, r, s] = await Promise.all([getFriendsList(), getPendingRequests(), getSentRequests()]);
  const initialData = {
    friends: f.ok ? f.data.friends : [],
    pendingReceived: r.ok ? r.data.requests : [],
    pendingSent: s.ok ? s.data.requests : [],
    errors: {
      friends: f.ok === false ? f.error.code : undefined,
      pendingReceived: r.ok === false ? r.error.code : undefined,
      pendingSent: s.ok === false ? s.error.code : undefined,
    },
  };

  return <SocialDashboard initialData={initialData} />;
}
