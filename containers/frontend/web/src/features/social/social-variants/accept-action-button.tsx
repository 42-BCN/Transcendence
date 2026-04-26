'use client';

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';

import { Text, IconButton } from '@components';
import { useSocialStore } from '../store/use-social-store';
import { respondToRequest } from '../actions/friendships.actions';

import type { FriendshipsErrorName } from '@/contracts/api/friendships/friendships.errors';
import type { ApiErrorShape } from '@/contracts/api/http/response';

export function AcceptActionButton({ friendshipId }: { friendshipId: string }) {
  const tActions = useTranslations('features.social.actions');
  const tErrors = useTranslations('errors');
  const acceptPendingById = useSocialStore((s) => s.acceptPendingById);
  const [error, setError] = useState<
    ApiErrorShape<FriendshipsErrorName | 'VALIDATION_ERROR'> | undefined
  >(undefined);

  const handleClick = useCallback(
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
        variant="primary"
        className="bg-success text-white"
        onPress={() => handleClick(friendshipId)}
      />
      {error && (
        <Text variant="caption" color="danger" className="w-full text-end">
          {tErrors(error.code as any)}
        </Text>
      )}
    </>
  );
}
