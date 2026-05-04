'use client';

import { SocialSocketManager } from '@/lib/sockets/friends-socket.manager';
import { useSocialStore } from './social-store.provider';

export function SocialSocketBridge() {
  const setFriendPresence = useSocialStore((state) => state.setFriendPresence);

  const receiveFriendRequest = useSocialStore((state) => state.receiveFriendRequest);
  const receiveFriendAccepted = useSocialStore((state) => state.receiveFriendAccepted);
  const receiveFriendRejected = useSocialStore((state) => state.receiveFriendRejected);

  return (
    <SocialSocketManager
      onFriendOnline={(payload) => setFriendPresence(payload.userId, 'online')}
      onFriendAway={(payload) => setFriendPresence(payload.userId, 'away')}
      onFriendOffline={(payload) => setFriendPresence(payload.userId, 'offline')}
      onFriendRequest={receiveFriendRequest}
      onFriendAccepted={receiveFriendAccepted}
      onFriendRejected={receiveFriendRejected}
    />
  );
}
