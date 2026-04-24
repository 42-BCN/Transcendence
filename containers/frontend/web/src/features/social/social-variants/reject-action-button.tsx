import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';

import { Text, IconButton } from '@components';
import { PendingListKey, useSocialStore } from '../store/use-social-store';
import { respondToRequest, deleteFriendship } from '../actions/social.actions';

export function RejectActionButton({
  type,
  friendshipId,
}: {
  type: PendingListKey;
  friendshipId: string;
}) {
  const tActions = useTranslations('features.social.actions');
  const tErrors = useTranslations('errors');
  const removePendingById = useSocialStore((s) => s.removePendingById);
  const [error, setError] = useState<any>(undefined);

  const handleClick = useCallback(
    async (id: string, listType: PendingListKey) => {
      const response =
        listType === 'pendingSent'
          ? await deleteFriendship(id)
          : await respondToRequest(id, 'reject');

      if (response.ok) removePendingById(listType, id);
      else setError(response.error);
    },
    [removePendingById],
  );

  return (
    <>
      <IconButton
        label={tActions(type === 'pendingSent' ? 'cancel' : 'reject')}
        icon="close"
        className="text-red-500 border-red-500"
        onPress={() => handleClick(friendshipId, type)}
      />
      {error && (
        <Text variant="caption" color="danger" className="w-full text-end">
          {tErrors(error.code as any)}
        </Text>
      )}
    </>
  );
}
