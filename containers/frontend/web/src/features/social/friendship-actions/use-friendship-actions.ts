'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

import { useSocialStore } from '@/providers/social-provider';

import { createFriendshipActions } from './friendship-actions.config';
import { createFriendshipActionHandlers } from './friendship-actions.handlers';
import type { FriendshipActionError } from './friendship-actions.types';
import { getFriendshipStatus } from './friendship-actions.utils';

export function useFriendshipActions({
  userId,
  username,
}: {
  userId: string;
  username?: string;
}) {
  const t = useTranslations('features.social.actions');
  const [error, setError] = useState<FriendshipActionError>();

  const friends = useSocialStore((state) => state.friends);
  const pendingReceived = useSocialStore((state) => state.pendingReceived);
  const pendingSent = useSocialStore((state) => state.pendingSent);
  const removeFriendById = useSocialStore((state) => state.removeFriendById);
  const removePendingById = useSocialStore((state) => state.removePendingById);
  const addPendingRequest = useSocialStore((state) => state.addPendingRequest);
  const acceptPendingById = useSocialStore((state) => state.acceptPendingById);

  const friend = friends.find((item) => item.id === userId);
  const requestReceived = pendingReceived.find((item) => item.userId === userId);
  const requestSent = pendingSent.find((item) => item.userId === userId);
  const resolvedUsername = username ?? friend?.username ?? requestReceived?.username ?? requestSent?.username;

  const handlers = createFriendshipActionHandlers({
    userId,
    friend,
    requestReceived,
    requestSent,
    setError,
    removeFriendById,
    removePendingById,
    addPendingRequest,
    acceptPendingById,
  });

  return createFriendshipActions({
    userId,
    username: resolvedUsername,
    t,
    error,
    handlers,
    status: getFriendshipStatus({ friend, requestReceived, requestSent }),
    unreadMessageCount: friend?.unreadMessageCount,
  });
}
