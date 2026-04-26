'use client';

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { useSocialStore } from '../store/use-social-store';
import { IconButton, Text } from '@components';
import { sendFriendRequest } from '../actions/friendships.actions';
import type { FriendshipsErrorName } from '@/contracts/api/friendships/friendships.errors';
import type { ApiErrorShape } from '@/contracts/api/http/response';

interface InviteActionButtonProps {
  userId: string;
}

export function InviteActionButton({ userId }: InviteActionButtonProps) {
  const tActions = useTranslations('features.social.actions');
  const tErrors = useTranslations('errors');
  const addPendingRequest = useSocialStore((state) => state.addPendingRequest);
  const [error, setError] = useState<
    ApiErrorShape<FriendshipsErrorName | 'VALIDATION_ERROR'> | undefined
  >(undefined);

  const handleInvite = useCallback(async () => {
    setError(undefined);
    const result = await sendFriendRequest(userId);

    if (result.ok) {
      addPendingRequest(result.data.friendship);
    } else {
      setError(result.error);
    }
  }, [userId, addPendingRequest]);

  return (
    <>
      <IconButton
        label={tActions('addFriend')}
        icon="userAdd"
        variant="secondary"
        onPress={handleInvite}
      />
      {error && (
        <Text variant="caption" color="danger" className="w-full text-end">
          {tErrors(error.code as any)}
        </Text>
      )}
    </>
  );
}
