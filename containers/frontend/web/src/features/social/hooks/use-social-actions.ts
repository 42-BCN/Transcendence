import { useCallback } from 'react';
import { useSocialStore } from '../store/use-social-store';
import { useSocialData } from './use-social-data';
import { respondToRequest, deleteFriendship } from '../actions/social.actions';

export function useSocialActions() {
  const { refreshAll } = useSocialData();
  const setLoading = useSocialStore((s) => s.setLoading);
  const setError = useSocialStore((s) => s.setError);

  const handleResponse = useCallback(
    async (id: string, action: 'accept' | 'reject') => {
      setLoading(true);
      const response = await respondToRequest(id, action);
      if (response.ok) await refreshAll();
      else return response.error.code;
      setLoading(false);
    },
    [refreshAll, setLoading, setError],
  );

  const handleDelete = useCallback(
    async (id: string) => {
      setLoading(true);
      const response = await deleteFriendship(id);
      if (response.ok) await refreshAll();
      else setError('Delete failed');
      setLoading(false);
    },

    [refreshAll, setLoading, setError],
  );

  return {
    handleResponse,
    handleDelete,
  };
}
