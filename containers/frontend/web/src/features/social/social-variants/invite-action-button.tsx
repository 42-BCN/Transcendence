'use client';

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { IconButton, Icon } from '@components';
import { sendFriendRequest } from '../actions/friendships.actions';

interface InviteActionButtonProps {
  userId: string;
}

export function InviteActionButton({ userId }: InviteActionButtonProps) {
  const t = useTranslations('features.social.actions');
  const [isPending, setIsPending] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleInvite = useCallback(async () => {
    setIsPending(true);
    const result = await sendFriendRequest(userId);
    setIsPending(false);

    if (result.ok) {
      setIsSent(true);
    }
  }, [userId]);

  if (isSent) {
    return (
      <div className="flex h-10 w-10 items-center justify-center text-success">
        <Icon name="check" size={24} />
      </div>
    );
  }

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
