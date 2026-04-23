import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';

import { Text, IconButton } from '@components';
import { PendingListKey, useSocialStore } from '../store/use-social-store';
import { respondToRequest } from '../actions/social.actions';

export function RejectActionButton({
  type,
  friendshipId,
}: {
  type: PendingListKey;
  friendshipId: string;
}) {
  const tActions = useTranslations('features.social.actions');
  const removePendingById = useSocialStore((s) => s.removePendingById);
  const [error, setError] = useState(undefined);

  const handleResponse = useCallback(async (id: string, action: 'accept' | 'reject') => {
    const response = await respondToRequest(id, action);
    if (response.ok) removePendingById(type, id);
    else setError(response.error);
  }, []);

  return (
    <>
      <IconButton
        label={tActions('reject')}
        icon="close"
        className="text-red-500 border-red-500"
        onPress={() => handleResponse(friendshipId, 'reject')}
      />
      {error && (
        <Text variant="caption" color="danger" className="w-full text-end">
          {error.code}
        </Text>
      )}
    </>
  );
}
