'use client';

import { useEffect } from 'react';

import {
  friendshipSocketEvents,
  presenceSocketEvents,
  type FriendAcceptedNotificationPayload,
  type FriendRejectedNotificationPayload,
  type FriendRequestNotificationPayload,
  type PresenceAwayPayload,
  type PresenceOfflinePayload,
  type PresenceOnlinePayload,
} from '@/contracts/sockets/friendships/friendships.schema';
import { friendsSocket } from './friends-socket.client';

type SocialSocketManagerProps = {
  onFriendOnline: (payload: PresenceOnlinePayload) => void;
  onFriendAway: (payload: PresenceAwayPayload) => void;
  onFriendOffline: (payload: PresenceOfflinePayload) => void;
  onFriendRequest: (payload: FriendRequestNotificationPayload) => void;
  onFriendAccepted: (payload: FriendAcceptedNotificationPayload) => void;
  onFriendRejected: (payload: FriendRejectedNotificationPayload) => void;
};

export const SocialSocketManager = ({
  onFriendOnline,
  onFriendAway,
  onFriendOffline,
  onFriendRequest,
  onFriendAccepted,
  onFriendRejected,
}: SocialSocketManagerProps) => {
  useEffect(() => {
    const handleConnect = () => {
      console.log('Connected to friends socket server', friendsSocket.id);
    };

    const handleDisconnect = () => {
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

    const handleVisibilityChange = () => {
      friendsSocket.emit(document.hidden ? presenceSocketEvents.away : presenceSocketEvents.active);
    };

    const reservedListeners = [
      ['connect', handleConnect],
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

    document.addEventListener('visibilitychange', handleVisibilityChange);

    friendsSocket.connect();

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

      document.removeEventListener('visibilitychange', handleVisibilityChange);

      friendsSocket.disconnect();
    };
  }, [
    onFriendOnline,
    onFriendAway,
    onFriendOffline,
    onFriendRequest,
    onFriendAccepted,
    onFriendRejected,
  ]);

  return null;
};
