'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import type { Socket } from 'socket.io-client';


import { envPublic } from '@/lib/config/env.public';
import { directMessagesSocket } from './direct-messages-socket.client';
import { friendsSocket } from './friends-socket.client';
import {
  chatSocket,
  gameRoomSocket,
  gameSocket,
  resetChatSessionIdentity,
  setGuestSessionBootstrapEnabled,
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
const AUTH_BROADCAST_STORAGE_KEY = 'transcendence:auth-broadcast';
const AUTH_BROADCAST_CHANNEL_NAME = 'transcendence:auth';
const AUTH_BROADCAST_IDENTITY_STORAGE_KEY = 'transcendence:auth-broadcast-identity';

let sessionSyncedAsUser = false;
let sessionIdentityPromise: Promise<SessionIdentity | null> | null = null;
let lastSessionIdentity: SessionIdentity | null = null;
let lastSessionIdentityAt = 0;
const SESSION_IDENTITY_CACHE_MS = 1000;

export function isSessionSyncedAsUser(): boolean {
  return sessionSyncedAsUser;
}

function hasMountedListeners(socket: {
  listeners: (event: string) => unknown[];
}) {
  return socket.listeners('connect').length > 0 || socket.listeners('disconnect').length > 0;
}

async function getCurrentSessionIdentity(): Promise<SessionIdentity | null> {
  if (sessionIdentityPromise) {
    return sessionIdentityPromise;
  }

  if (Date.now() - lastSessionIdentityAt < SESSION_IDENTITY_CACHE_MS) {
    return lastSessionIdentity;
  }

  const endpoint = `${envPublic.apiBaseUrl.replace(/\/$/, '')}/auth/session/identity`;

  sessionIdentityPromise = fetch(endpoint, {
    method: 'GET',
    credentials: 'include',
    headers: { Accept: 'application/json' },
    cache: 'no-store',
  })
    .then(async (response) => {
      if (!response.ok) {
        lastSessionIdentity = null;
        lastSessionIdentityAt = Date.now();
        return null;
      }

      const body = (await response.json().catch(() => null)) as SessionIdentityResponse | null;
      const identity = body?.ok && body.data ? body.data : null;
      lastSessionIdentity = identity;
      lastSessionIdentityAt = Date.now();
      return identity;
    })
    .finally(() => {
      sessionIdentityPromise = null;
    });

  return sessionIdentityPromise;
}

function invalidateCurrentSessionIdentityCache() {
  lastSessionIdentity = null;
  lastSessionIdentityAt = 0;
}

function restartSocket(socket: Socket) {
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
  if (roomId === null) {
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
  const lastIsGuestRef = useRef<boolean | null>(null);
  const authChannelRef = useRef<BroadcastChannel | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;

    const syncSocketsToSession = async (reason: 'passive' | 'local' | 'external' = 'passive') => {
      const identity = await getCurrentSessionIdentity().catch(() => null);
      if (!isMounted) {
        return;
      }

      const nextIdentityKey = identity?.identityKey ?? null;
      const previousIdentityKey = lastIdentityKeyRef.current;
      const previousIsGuest = lastIsGuestRef.current;
      const identityChanged = previousIdentityKey !== nextIdentityKey;
      const shouldRefresh =
        identityChanged && (previousIdentityKey !== null || reason === 'external');

      if (previousIdentityKey === nextIdentityKey) {
        return;
      }

      lastIdentityKeyRef.current = nextIdentityKey;
      lastIsGuestRef.current = identity?.isGuest ?? null;
      window.dispatchEvent(new CustomEvent(REALTIME_IDENTITY_CHANGED_EVENT));

      if (!nextIdentityKey) {
        setGuestSessionBootstrapEnabled(false);
        resetChatSessionIdentity();
        sessionSyncedAsUser = false;
        disconnectSocket(chatSocket);
        disconnectSocket(gameRoomSocket);
        disconnectSocket(gameSocket);
        disconnectSocket(friendsSocket);
        disconnectSocket(directMessagesSocket);
        window.sessionStorage.removeItem(ACTIVE_ROOM_STORAGE_KEY);
        if (shouldRefresh) {
          window.location.reload();
        }
        return;
      }

      setGuestSessionBootstrapEnabled(true);

      disconnectSocket(chatSocket);
      disconnectSocket(gameSocket);
      disconnectSocket(gameRoomSocket);
      disconnectSocket(friendsSocket);
      disconnectSocket(directMessagesSocket);

      const wasGuest = previousIsGuest === true;
      if (wasGuest) {
        window.sessionStorage.removeItem(ACTIVE_ROOM_STORAGE_KEY);
      } else {
        await rejoinStoredRoomIfNeeded();
      }

      restartSocket(chatSocket);
      restartSocket(gameSocket);
      restartSocket(gameRoomSocket);

      if (identity?.isGuest === false && identity.userId) {
        sessionSyncedAsUser = true;
        restartSocket(friendsSocket);
        restartSocket(directMessagesSocket);
      } else {
        sessionSyncedAsUser = false;
      }

      if (shouldRefresh) {
        router.refresh();
      }
    };

    const handleAuthChanged = () => {
      invalidateCurrentSessionIdentityCache();
      void syncSocketsToSession('local');
    };

    const handleStorage = (event: StorageEvent) => {
      if (event.key !== AUTH_BROADCAST_STORAGE_KEY) {
        return;
      }

      invalidateCurrentSessionIdentityCache();
      void syncSocketsToSession('external');
    };

    const handleBroadcast = () => {
      invalidateCurrentSessionIdentityCache();
      void syncSocketsToSession('external');
    };

    if (typeof BroadcastChannel !== 'undefined') {
      authChannelRef.current = new BroadcastChannel(AUTH_BROADCAST_CHANNEL_NAME);
      authChannelRef.current.addEventListener('message', handleBroadcast);
    }

    void syncSocketsToSession('passive');

    window.addEventListener(AUTH_CHANGED_EVENT, handleAuthChanged);
    window.addEventListener('focus', handleAuthChanged);
    window.addEventListener('pageshow', handleAuthChanged);
    window.addEventListener('storage', handleStorage);

    return () => {
      isMounted = false;
      sessionSyncedAsUser = false;
      window.removeEventListener(AUTH_CHANGED_EVENT, handleAuthChanged);
      window.removeEventListener('focus', handleAuthChanged);
      window.removeEventListener('pageshow', handleAuthChanged);
      window.removeEventListener('storage', handleStorage);
      authChannelRef.current?.removeEventListener('message', handleBroadcast);
      authChannelRef.current?.close();
      authChannelRef.current = null;
    };
  }, [pathname, router]);

  return null;
}

export function notifyAuthChanged() {
  invalidateCurrentSessionIdentityCache();
  broadcastAuthChanged();
  window.dispatchEvent(new CustomEvent(AUTH_CHANGED_EVENT));
}

export function broadcastAuthChangedForIdentity(identityKey: string) {
  const lastBroadcastIdentity = window.sessionStorage.getItem(AUTH_BROADCAST_IDENTITY_STORAGE_KEY);

  if (lastBroadcastIdentity === identityKey) {
    return;
  }

  window.sessionStorage.setItem(AUTH_BROADCAST_IDENTITY_STORAGE_KEY, identityKey);
  broadcastAuthChanged();
}

export function clearAuthBroadcastIdentity() {
  window.sessionStorage.removeItem(AUTH_BROADCAST_IDENTITY_STORAGE_KEY);
}

export function broadcastAuthChanged() {
  window.localStorage.setItem(AUTH_BROADCAST_STORAGE_KEY, String(Date.now()));
  if (typeof BroadcastChannel !== 'undefined') {
    const channel = new BroadcastChannel(AUTH_BROADCAST_CHANNEL_NAME);
    channel.postMessage({ type: 'auth-changed', at: Date.now() });
    channel.close();
  }
}
