import { useCallback } from 'react';
import { useSocialStore } from '../store/use-social-store';
import { getFriendsList, getPendingRequests, getSentRequests } from '../actions/social.actions';

export function useSocialData() {
  const friends = useSocialStore((s) => s.friends);
  const pendingReceived = useSocialStore((s) => s.pendingReceived);
  const pendingSent = useSocialStore((s) => s.pendingSent);
  const isLoading = useSocialStore((s) => s.isLoading);
  const setFriends = useSocialStore((s) => s.setFriends);
  const setPendingReceived = useSocialStore((s) => s.setPendingReceived);
  const setPendingSent = useSocialStore((s) => s.setPendingSent);
  const setLoading = useSocialStore((s) => s.setLoading);
  const setError = useSocialStore((s) => s.setError);

  const refreshAll = useCallback(async () => {
    setLoading(true);
    try {
      const [f, r, s] = await Promise.allSettled([
        getFriendsList(),
        getPendingRequests(),
        getSentRequests(),
      ]);
      if (f.status === 'fulfilled' && f.value.ok) setFriends(f.value.data.friends);
      if (r.status === 'fulfilled' && r.value.ok) setPendingReceived(r.value.data.requests);
      if (s.status === 'fulfilled' && s.value.ok) setPendingSent(s.value.data.requests);
    } catch {
      setError('Refresh failed');
    } finally {
      setLoading(false);
    }
  }, [setFriends, setPendingReceived, setPendingSent, setLoading, setError]);

  return {
    friends,
    pendingReceived,
    pendingSent,
    isLoading,
    refreshAll,
  };
}
