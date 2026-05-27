'use client';

import { SocialSocketManager } from '@/lib/sockets/friends-socket.manager';
import { useSocialStore } from '@/providers/social-provider';
import type { DirectMessageUnreadUpdatedPayload } from '@/contracts/sockets/friendships/friendships.schema';

export function SocialSocketBridge() {
  const currentUserId = useSocialStore((state) => state.currentUserId);
  const setFriendPresence = useSocialStore((state) => state.setFriendPresence);

  const receiveFriendRequest = useSocialStore((state) => state.receiveFriendRequest);
  const receiveFriendAccepted = useSocialStore((state) => state.receiveFriendAccepted);
  const receiveFriendRejected = useSocialStore((state) => state.receiveFriendRejected);
  const setFriendUnreadMessageCount = useSocialStore((state) => state.setFriendUnreadMessageCount);

  if (!currentUserId) {
    return null;
  }

  return (
    <SocialSocketManager
      onFriendOnline={(payload) => setFriendPresence(payload.userId, 'online')}
      onFriendAway={(payload) => setFriendPresence(payload.userId, 'away')}
      onFriendOffline={(payload) => setFriendPresence(payload.userId, 'offline')}
      onFriendRequest={receiveFriendRequest}
      onFriendAccepted={receiveFriendAccepted}
      onFriendRejected={receiveFriendRejected}
      onUnreadUpdated={(payload: DirectMessageUnreadUpdatedPayload) =>
        setFriendUnreadMessageCount(payload.otherUserId, payload.unreadMessageCount)
      }
    />
  );
}
