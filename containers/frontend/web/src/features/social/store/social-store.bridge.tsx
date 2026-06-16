'use client';

import { useContext, useEffect } from 'react';

import { SocialSocketManager } from '@/lib/sockets/friends-socket.manager';
import { useSocialStore } from '@/providers/social-provider';
import type {
  DirectMessageUnreadUpdatedPayload,
  GameInvitationUpdatedPayload,
} from '@/contracts/sockets/friendships/friendships.schema';
import { fetchGameInvitationState } from '@/features/game-invitations/game-invitations.client';
import { GameInvitationsStoreContext } from '@/features/game-invitations/store/game-invitations.provider';

export function SocialSocketBridge() {
  const currentUserId = useSocialStore((state) => state.currentUserId);
  const setFriendPresence = useSocialStore((state) => state.setFriendPresence);

  const receiveFriendRequest = useSocialStore((state) => state.receiveFriendRequest);
  const receiveFriendAccepted = useSocialStore((state) => state.receiveFriendAccepted);
  const receiveFriendRejected = useSocialStore((state) => state.receiveFriendRejected);
  const setFriendUnreadMessageCount = useSocialStore((state) => state.setFriendUnreadMessageCount);

  const gameInvitationsStore = useContext(GameInvitationsStoreContext);

  const loadCanonicalState = () => {
    void fetchGameInvitationState().then((response) => {
      if (!response.ok) {
        gameInvitationsStore?.getState().resetInvitationState();
        return;
      }
      gameInvitationsStore?.getState().setInvitationState(response.data);
    });
  };

  useEffect(() => {
    if (!currentUserId) return;
    loadCanonicalState();
  }, [currentUserId]);

  if (!currentUserId) {
    return null;
  }

  const handleInvitationUpdated = (_payload: GameInvitationUpdatedPayload) => {
    loadCanonicalState();
  };

  const handleInvitationReceived = () => {
    loadCanonicalState();
  };

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
      onGameInvitationUpdated={handleInvitationUpdated}
      onGameInvitationReceived={handleInvitationReceived}
    />
  );
}
