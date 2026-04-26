'use client';

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { UserPlus, Check } from 'lucide-react';
import { Button } from '@/components';
import { sendFriendRequest } from '../actions/friendships.actions';

interface InviteActionButtonProps {
  userId: string;
}

export function InviteActionButton({ userId }: InviteActionButtonProps) {
  const t = useTranslations('features.social.actions');
  const [isPending, setIsPending] = useState(false);
  const [isSent, setIsSent] = useState(false);

  // We don't really need to update the global state here yet,
  // because the "Pending" status will be reflected on the next search
  // or if we decide to optimistic UI.

  const handleInvite = useCallback(async () => {
    setIsPending(true);
    const result = await sendFriendRequest(userId);
    setIsPending(false);

    if (result.ok) {
      setIsSent(true);
      // Optional: Update store to reflect the new sent request
      // so other components (like Requests tab) update immediately.
      // But for now, let's keep it simple.
    }
  }, [userId]);

  if (isSent) {
    return (
      <Button variant="ghost" size="sm" isDisabled className="gap-2">
        <Check size={16} />
        {t('addFriend')}
      </Button>
    );
  }

  return (
    <Button
      variant="secondary"
      size="sm"
      onPress={handleInvite}
      isLoading={isPending}
      className="gap-2"
    >
      <UserPlus size={16} />
      {t('addFriend')}
    </Button>
  );
}
