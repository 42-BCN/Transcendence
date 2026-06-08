'use client';

import { useCallback } from 'react';

import { SocialSocketManager } from '@/lib/sockets/friends-socket.manager';
import { useSocialStore } from '@/providers/social-provider';
import { getFriendsList } from '@/features/social/actions/social.server.actions';

export function SocialSocketBridge() {
  const currentUserId = useSocialStore((state) => state.currentUserId);
  const setFriendPresence = useSocialStore((state) => state.setFriendPresence);
  const setFriends = useSocialStore((state) => state.setFriends);

  const receiveFriendRequest = useSocialStore((state) => state.receiveFriendRequest);
  const receiveFriendAccepted = useSocialStore((state) => state.receiveFriendAccepted);
  const receiveFriendRejected = useSocialStore((state) => state.receiveFriendRejected);
  const setFriendUnreadMessageCount = useSocialStore((state) => state.setFriendUnreadMessageCount);

  if (!currentUserId) {
    return null;
  }

  const handleReconnect = useCallback(async () => {
    const result = await getFriendsList();
    if (result.ok) {
      setFriends(result.data.friends);
    }
  }, [setFriends]);

  return (
    <SocialSocketManager
      onFriendOnline={(payload) => setFriendPresence(payload.userId, 'online')}
      onFriendAway={(payload) => setFriendPresence(payload.userId, 'away')}
      onFriendOffline={(payload) => setFriendPresence(payload.userId, 'offline')}
      onFriendRequest={receiveFriendRequest}
      onFriendAccepted={receiveFriendAccepted}
      onFriendRejected={receiveFriendRejected}
      onReconnect={handleReconnect}
    />
  );
}
