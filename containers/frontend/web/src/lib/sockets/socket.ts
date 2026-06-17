import { io } from 'socket.io-client';
import type { Socket } from 'socket.io-client';

import { envPublic } from '@/lib/config/env.public';
import type {
  ServerToClientChatEvents,
  ClientToServerChatEvents,
} from '@/contracts/sockets/chat/chat.schema';

import type {
  ServerToClientGameEvents,
  ClientToServerGameEvents,
} from '@/contracts/sockets/game/game.schema';

import type {
  ServerToClientGameRoomsEvents,
  ClientToServerGameRoomsEvents,
} from '@/contracts/sockets/rooms/gameRooms.schema';

export type Robot = {
  id: string;
  position: [number, number, number];
  color: string;
};

type ServerToClientRobotsEvents = {
  robots: (robots: Robot[]) => void;
};

type ClientToServerRobotsEvents = {
  moveTo: (target: [number, number, number]) => void;
};

let sessionPromise: Promise<void> | null = null;
let guestSessionBootstrapEnabled = true;
let lastSessionEnsureAt = 0;
const SESSION_ENSURE_CACHE_MS = 1000;

export async function ensureChatSessionIdentity(): Promise<void> {
  if (sessionPromise) return sessionPromise;

  if (Date.now() - lastSessionEnsureAt < SESSION_ENSURE_CACHE_MS) {
    return Promise.resolve();
  }

  const baseUrl = envPublic.apiBaseUrl.replace(/\/$/, '');
  const identityEndpoint = `${baseUrl}/auth/session/identity`;
  const guestEndpoint = `${baseUrl}/auth/guest/session`;

  sessionPromise = fetch(identityEndpoint, {
    method: 'GET',
    credentials: 'include',
    headers: { Accept: 'application/json' },
    cache: 'no-store',
  })
    .then((response) => {
      if (response.ok) {
        return;
      }

      if (response.status === 429) {
        return;
      }

      if (response.status !== 401) {
        sessionPromise = null;
        throw new Error(`Failed to read session identity (${response.status})`);
      }

      if (!guestSessionBootstrapEnabled) {
        return;
      }

      return fetch(guestEndpoint, {
        method: 'POST',
        credentials: 'include',
        headers: { Accept: 'application/json' },
      }).then((guestResponse) => {
        if (guestResponse.status === 429) {
          return;
        }

        if (!guestResponse.ok) {
          sessionPromise = null;
          throw new Error(
            `Failed to initialize chat session identity (${guestResponse.status})`,
          );
        }
      });
    })
    .then(() => {
      lastSessionEnsureAt = Date.now();
    })
    .catch((error) => {
      sessionPromise = null;
      throw error;
    })
    .finally(() => {
      sessionPromise = null;
    });

  return sessionPromise;
}

export function resetChatSessionIdentity(): void {
  sessionPromise = null;
  lastSessionEnsureAt = 0;
}

export function setGuestSessionBootstrapEnabled(enabled: boolean): void {
  guestSessionBootstrapEnabled = enabled;
}

function createSocketUrl(pathname: string): string {
  const baseUrl = typeof window === 'undefined' ? envPublic.socketUrl : window.location.origin;
  return new URL(pathname, baseUrl).toString();
}

const robotsSocketUrl = createSocketUrl('/robots');
const chatSocketUrl = createSocketUrl('/chat');
const gameRoomSocketUrl = createSocketUrl('/game-room');
const gameSocketUrl = createSocketUrl('/game');

export const gameSocket: Socket<ServerToClientGameEvents, ClientToServerGameEvents> = io(
  gameSocketUrl,
  {
    autoConnect: false,
    transports: ['websocket', 'polling'],
    withCredentials: true,
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
  },
);

gameSocket.on('connect_error', (error: unknown) => {
  console.error('🔴 [gameSocket] connect_error:', error);
  if (error instanceof Error) {
    console.error('  Error message:', error.message);
    console.error('  Error stack:', error.stack);
  }
});

envPublic.processEnv === 'development' && console.log('📋 [gameSocket] Configured for URL:', gameSocketUrl);

export const robotsSocket: Socket<ServerToClientRobotsEvents, ClientToServerRobotsEvents> = io(
  robotsSocketUrl,
  {
    autoConnect: false,
    transports: ['websocket', 'polling'],
    withCredentials: true,
  },
);

export const chatSocket: Socket<ServerToClientChatEvents, ClientToServerChatEvents> = io(
  chatSocketUrl,
  {
    autoConnect: false,
    transports: ['websocket', 'polling'],
    withCredentials: true,
    auth: {},
  },
);

export const gameRoomSocket: Socket<
  ServerToClientGameRoomsEvents,
  ClientToServerGameRoomsEvents
> = io(gameRoomSocketUrl, {
  autoConnect: false,
  transports: ['websocket'],
  withCredentials: true,
});
