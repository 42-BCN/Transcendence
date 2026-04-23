import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';

import { Text, IconButton } from '@components';
import { useSocialStore } from '../store/use-social-store';
import { respondToRequest } from '../actions/social.actions';

export function AcceptActionButton({ friendshipId }: { friendshipId: string }) {
  const tActions = useTranslations('features.social.actions');
  const tErrors = useTranslations('errors');
  const acceptPendingById = useSocialStore((s) => s.acceptPendingById);
  const [error, setError] = useState<any>(undefined);

  const handleResponse = useCallback(
    async (id: string) => {
      const response = await respondToRequest(id, 'accept');
      if (response.ok) acceptPendingById(id);
      else setError(response.error);
    },
    [acceptPendingById],
  );

  return (
    <>
      <IconButton
        label={tActions('accept')}
        icon="check"
        className="text-green-500 border-green-500"
        onPress={() => handleResponse(friendshipId)}
      />
      {error && (
        <Text variant="caption" color="danger" className="w-full text-end">
          {tErrors(error.code as any)}
        </Text>
      )}
    </>
  );
}
