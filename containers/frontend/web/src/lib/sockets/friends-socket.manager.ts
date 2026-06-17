'use client';

import { useEffect } from 'react';

import { envPublic } from '@/lib/config/env.public';

import {
  directMessageUnreadSocketEvents,
  gameInvitationSocketEvents,
  type DirectMessageUnreadUpdatedPayload,
  friendshipSocketEvents,
  presenceSocketEvents,
  type FriendAcceptedNotificationPayload,
  type FriendRejectedNotificationPayload,
  type FriendRequestNotificationPayload,
  type GameInvitationReceivedPayload,
  type GameInvitationUpdatedPayload,
  type PresenceAwayPayload,
  type PresenceOfflinePayload,
  type PresenceOnlinePayload,
} from '@/contracts/sockets/friendships/friendships.schema';

import { friendsSocket } from './friends-socket.client';
import { isSessionSyncedAsUser } from './realtime-session-bridge';

type SocialSocketManagerProps = {
  onFriendOnline: (payload: PresenceOnlinePayload) => void;
  onFriendAway: (payload: PresenceAwayPayload) => void;
  onFriendOffline: (payload: PresenceOfflinePayload) => void;
  onFriendRequest: (payload: FriendRequestNotificationPayload) => void;
  onFriendAccepted: (payload: FriendAcceptedNotificationPayload) => void;
  onFriendRejected: (payload: FriendRejectedNotificationPayload) => void;
  onUnreadUpdated: (payload: DirectMessageUnreadUpdatedPayload) => void;
  onGameInvitationUpdated: (payload: GameInvitationUpdatedPayload) => void;
  onGameInvitationReceived: (payload: GameInvitationReceivedPayload) => void;
};

export const SocialSocketManager = ({
  onFriendOnline,
  onFriendAway,
  onFriendOffline,
  onFriendRequest,
  onFriendAccepted,
  onFriendRejected,
  onUnreadUpdated,
  onGameInvitationUpdated,
  onGameInvitationReceived,
}: SocialSocketManagerProps) => {
  useEffect(() => {
    const emitCurrentPresence = () => {
      friendsSocket.emit(document.hidden ? presenceSocketEvents.away : presenceSocketEvents.active);
    };

    const handleConnect = () => {
      envPublic.processEnv === 'development' &&
        console.log('Connected to friends socket server', friendsSocket.id);
      emitCurrentPresence();
    };

    const handleConnectError = (error: Error) => {
      envPublic.processEnv === 'development' &&
        console.error('Friends socket connect error', error);
    };

    const handleDisconnect = () => {
      envPublic.processEnv === 'development' &&
        console.log('Disconnected from friends socket server');
    };

    const handleFriendOnline = (payload: PresenceOnlinePayload) => {
      onFriendOnline(payload);
    };

    const handleFriendAway = (payload: PresenceAwayPayload) => {
      onFriendAway(payload);
    };

    const handleFriendOffline = (payload: PresenceOfflinePayload) => {
      onFriendOffline(payload);
    };

    const handleFriendRequest = (payload: FriendRequestNotificationPayload) => {
      onFriendRequest(payload);
    };

    const handleFriendAccepted = (payload: FriendAcceptedNotificationPayload) => {
      onFriendAccepted(payload);
    };

    const handleFriendRejected = (payload: FriendRejectedNotificationPayload) => {
      onFriendRejected(payload);
    };

    const handleUnreadUpdated = (payload: DirectMessageUnreadUpdatedPayload) => {
      onUnreadUpdated(payload);
    };

    const handleGameInvitationUpdated = (payload: GameInvitationUpdatedPayload) => {
      onGameInvitationUpdated(payload);
    };

    const handleGameInvitationReceived = (payload: GameInvitationReceivedPayload) => {
      onGameInvitationReceived(payload);
    };

    const reservedListeners = [
      ['connect', handleConnect],
      ['connect_error', handleConnectError],
      ['disconnect', handleDisconnect],
    ] as const;

    const presenceListeners = [
      [presenceSocketEvents.online, handleFriendOnline],
      [presenceSocketEvents.away, handleFriendAway],
      [presenceSocketEvents.offline, handleFriendOffline],
    ] as const;

    const friendshipListeners = [
      [friendshipSocketEvents.request, handleFriendRequest],
      [friendshipSocketEvents.accepted, handleFriendAccepted],
      [friendshipSocketEvents.rejected, handleFriendRejected],
      [directMessageUnreadSocketEvents.updated, handleUnreadUpdated],
      [gameInvitationSocketEvents.updated, handleGameInvitationUpdated],
      [gameInvitationSocketEvents.received, handleGameInvitationReceived],
    ] as const;

    reservedListeners.forEach(([event, handler]) => {
      friendsSocket.on(event, handler);
    });

    presenceListeners.forEach(([event, handler]) => {
      friendsSocket.on(event, handler);
    });

    friendshipListeners.forEach(([event, handler]) => {
      friendsSocket.on(event, handler);
    });

    document.addEventListener('visibilitychange', emitCurrentPresence);

    if (isSessionSyncedAsUser() && !friendsSocket.connected) {
      friendsSocket.connect();
    }

    return () => {
      reservedListeners.forEach(([event, handler]) => {
        friendsSocket.off(event, handler);
      });

      presenceListeners.forEach(([event, handler]) => {
        friendsSocket.off(event, handler);
      });

      friendshipListeners.forEach(([event, handler]) => {
        friendsSocket.off(event, handler);
      });

      document.removeEventListener('visibilitychange', emitCurrentPresence);

      friendsSocket.disconnect();
    };
  }, [
    onFriendOnline,
    onFriendAway,
    onFriendOffline,
    onFriendRequest,
    onFriendAccepted,
    onFriendRejected,
    onUnreadUpdated,
    onGameInvitationUpdated,
    onGameInvitationReceived,
  ]);

  return null;
};
