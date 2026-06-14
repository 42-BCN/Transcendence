'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

import { envPublic } from '@/lib/config/env.public';
import { directMessagesSocket } from './direct-messages-socket.client';
import { friendsSocket } from './friends-socket.client';
import {
  chatSocket,
  gameRoomSocket,
  gameSocket,
  resetChatSessionIdentity,
} from './socket';

type SessionIdentity = {
  identityKey: string;
  username: string;
  isGuest: boolean;
  userId?: string;
  guestId?: string;
  previousGuestId?: string;
};

type SessionIdentityResponse = {
  ok: boolean;
  data?: SessionIdentity;
};

const AUTH_CHANGED_EVENT = 'transcendence:auth-changed';
export const REALTIME_IDENTITY_CHANGED_EVENT = 'transcendence:realtime-identity-changed';
const ACTIVE_ROOM_STORAGE_KEY = 'transcendence:active-room-id';

function hasMountedListeners(socket: {
  listeners: (event: string) => unknown[];
}) {
  return socket.listeners('connect').length > 0 || socket.listeners('disconnect').length > 0;
}

function hasMountedGameRoomListeners() {
  return (
    gameRoomSocket.listeners('gameRoom:room:update').length > 0
    || gameRoomSocket.listeners('gameRoom:debug:msg').length > 0
    || gameRoomSocket.listeners('gameRoom:error:msg').length > 0
    || gameRoomSocket.listeners('gameRoom:room:joined').length > 0
    || gameRoomSocket.listeners('gameRoom:room:left').length > 0
  );
}

async function getCurrentSessionIdentity(): Promise<SessionIdentity | null> {
  const endpoint = `${envPublic.apiBaseUrl.replace(/\/$/, '')}/auth/session/identity`;

  const response = await fetch(endpoint, {
    method: 'GET',
    credentials: 'include',
    headers: { Accept: 'application/json' },
    cache: 'no-store',
  });

  if (!response.ok) {
    return null;
  }

  const body = (await response.json().catch(() => null)) as SessionIdentityResponse | null;
  return body?.ok && body.data ? body.data : null;
}

function restartSocket(socket: {
  connected: boolean;
  connect: () => void;
  disconnect: () => void;
  listeners: (event: string) => unknown[];
}) {
  if (socket.connected) {
    socket.disconnect();
    socket.connect();
    return;
  }

  if (hasMountedListeners(socket)) {
    socket.connect();
  }
}

function disconnectSocket(socket: {
  connected: boolean;
  disconnect: () => void;
}) {
  if (socket.connected) {
    socket.disconnect();
  }
}

function getStoredRoomId() {
  const rawRoomId = window.sessionStorage.getItem(ACTIVE_ROOM_STORAGE_KEY);
  const roomId = rawRoomId ? Number(rawRoomId) : NaN;
  return Number.isInteger(roomId) && roomId > 0 ? roomId : null;
}

async function rejoinStoredRoomIfNeeded() {
  const roomId = getStoredRoomId();
  if (roomId === null || !hasMountedGameRoomListeners()) {
    return;
  }

  await new Promise<void>((resolve) => {
    const complete = () => {
      gameRoomSocket.off('gameRoom:room:update', handleRoomUpdate);
      gameRoomSocket.off('connect', handleConnect);
      resolve();
    };

    const handleRoomUpdate = (state: { id: number }) => {
      if (state.id === roomId) {
        complete();
      }
    };

    const handleConnect = () => {
      gameRoomSocket.emit('gameRoom:teammate:join', roomId);
    };

    gameRoomSocket.on('gameRoom:room:update', handleRoomUpdate);
    gameRoomSocket.on('connect', handleConnect);

    if (gameRoomSocket.connected) {
      handleConnect();
    } else {
      gameRoomSocket.connect();
    }

    window.setTimeout(complete, 1500);
  });
}

export function RealtimeSessionBridge() {
  const lastIdentityKeyRef = useRef<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    let isMounted = true;

    const syncSocketsToSession = async () => {
      const identity = await getCurrentSessionIdentity().catch(() => null);
      if (!isMounted) {
        return;
      }

      const nextIdentityKey = identity?.identityKey ?? null;
      const previousIdentityKey = lastIdentityKeyRef.current;

      if (previousIdentityKey === nextIdentityKey) {
        return;
      }

      lastIdentityKeyRef.current = nextIdentityKey;
      resetChatSessionIdentity();
      window.dispatchEvent(new CustomEvent(REALTIME_IDENTITY_CHANGED_EVENT));

      if (!nextIdentityKey) {
        disconnectSocket(chatSocket);
        disconnectSocket(gameRoomSocket);
        disconnectSocket(gameSocket);
        disconnectSocket(friendsSocket);
        disconnectSocket(directMessagesSocket);
        return;
      }

      disconnectSocket(chatSocket);
      disconnectSocket(gameSocket);
      disconnectSocket(gameRoomSocket);

      await rejoinStoredRoomIfNeeded();

      restartSocket(chatSocket);
      restartSocket(gameSocket);

      if (identity?.isGuest === false && identity.userId) {
        restartSocket(friendsSocket);
        restartSocket(directMessagesSocket);
      }
    };

    const handleAuthChanged = () => {
      void syncSocketsToSession();
    };

    void syncSocketsToSession();

    window.addEventListener(AUTH_CHANGED_EVENT, handleAuthChanged);
    window.addEventListener('focus', handleAuthChanged);
    window.addEventListener('pageshow', handleAuthChanged);

    return () => {
      isMounted = false;
      window.removeEventListener(AUTH_CHANGED_EVENT, handleAuthChanged);
      window.removeEventListener('focus', handleAuthChanged);
      window.removeEventListener('pageshow', handleAuthChanged);
    };
  }, [pathname]);

  return null;
}

export function notifyAuthChanged() {
  window.dispatchEvent(new CustomEvent(AUTH_CHANGED_EVENT));
}
