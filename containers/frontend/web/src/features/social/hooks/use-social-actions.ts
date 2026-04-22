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
      try {
        const response = await respondToRequest(id, action);
        if (response.ok) {
          await refreshAll();
        } else {
          setError('Response failed');
        }
      } catch (error) {
        console.error('[useSocialActions] handleResponse error:', error);
        setError('Network error');
      } finally {
        setLoading(false);
      }
    },
    [refreshAll, setLoading, setError],
  );

  const handleDelete = useCallback(
    async (id: string) => {
      setLoading(true);
      try {
        const response = await deleteFriendship(id);
        if (response.ok) {
          await refreshAll();
        } else {
          setError('Delete failed');
        }
      } catch (error) {
        console.error('[useSocialActions] handleDelete error:', error);
        setError('Network error');
      } finally {
        setLoading(false);
      }
    },
    [refreshAll, setLoading, setError],
  );

  return {
    handleResponse,
    handleDelete,
  };
}
