'use client';

import { SocialSocketManager } from '@/lib/sockets/friends-socket.manager';
import { useSocialStore } from './social-store.provider';

export function SocialSocketBridge() {
  const setFriendOnlineStatus = useSocialStore((state) => state.setFriendOnlineStatus);

  const receiveFriendRequest = useSocialStore((state) => state.receiveFriendRequest);
  const receiveFriendAccepted = useSocialStore((state) => state.receiveFriendAccepted);
  const receiveFriendRejected = useSocialStore((state) => state.receiveFriendRejected);

  return (
    <SocialSocketManager
      onFriendOnline={(payload) => setFriendOnlineStatus(payload.userId, true)}
      onFriendAway={(payload) => setFriendOnlineStatus(payload.userId, true)}
      onFriendOffline={(payload) => setFriendOnlineStatus(payload.userId, false)}
      onFriendRequest={receiveFriendRequest}
      onFriendAccepted={receiveFriendAccepted}
      onFriendRejected={receiveFriendRejected}
    />
  );
}
