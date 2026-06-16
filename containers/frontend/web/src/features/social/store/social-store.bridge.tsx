'use client';

import { useEffect } from 'react';

import { SocialSocketManager } from '@/lib/sockets/friends-socket.manager';
import { useSocialStore } from '@/providers/social-provider';
import type {
  DirectMessageUnreadUpdatedPayload,
  GameInvitationReceivedPayload,
  GameInvitationUpdatedPayload,
} from '@/contracts/sockets/friendships/friendships.schema';
import { fetchActiveGameInvitationSummary } from '@/features/game-invitations/game-invitations.client';

export function SocialSocketBridge() {
  const currentUserId = useSocialStore((state) => state.currentUserId);
  const setFriendPresence = useSocialStore((state) => state.setFriendPresence);

  const receiveFriendRequest = useSocialStore((state) => state.receiveFriendRequest);
  const receiveFriendAccepted = useSocialStore((state) => state.receiveFriendAccepted);
  const receiveFriendRejected = useSocialStore((state) => state.receiveFriendRejected);
  const setFriendUnreadMessageCount = useSocialStore((state) => state.setFriendUnreadMessageCount);
  const setActiveGameInvitationSummary = useSocialStore(
    (state) => state.setActiveGameInvitationSummary,
  );
  const receiveGameInvitationMessage = useSocialStore(
    (state) => state.receiveGameInvitationMessage,
  );

  useEffect(() => {
    if (!currentUserId) {
      return;
    }

    void fetchActiveGameInvitationSummary().then((response) => {
      if (!response.ok) {
        setActiveGameInvitationSummary({
          activeInvitationCount: 0,
          activeInvitationIds: [],
        });
        return;
      }

      setActiveGameInvitationSummary(response.data);
    });
  }, [currentUserId, setActiveGameInvitationSummary]);

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
      onGameInvitationUpdated={(payload: GameInvitationUpdatedPayload) =>
        setActiveGameInvitationSummary(payload)
      }
      onGameInvitationReceived={(payload: GameInvitationReceivedPayload) =>
        receiveGameInvitationMessage(payload)
      }
    />
  );
}
