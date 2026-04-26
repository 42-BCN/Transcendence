'use client';

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { useSocialStore } from '../store/use-social-store';
import { IconButton } from '@components';
import { sendFriendRequest } from '../actions/friendships.actions';

interface InviteActionButtonProps {
  userId: string;
}

export function InviteActionButton({ userId }: InviteActionButtonProps) {
  const t = useTranslations('features.social.actions');
  const addPendingRequest = useSocialStore((state) => state.addPendingRequest);
  const [isPending, setIsPending] = useState(false);

  const handleInvite = useCallback(async () => {
    setIsPending(true);
    const result = await sendFriendRequest(userId);
    setIsPending(false);

    if (result.ok) {
      addPendingRequest(result.data.friendship);
    }
  }, [userId, addPendingRequest]);

  return (
    <IconButton
      label={t('addFriend')}
      icon="userAdd"
      variant="secondary"
      onPress={handleInvite}
      isLoading={isPending}
    />
  );
}
