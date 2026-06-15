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

export async function ensureChatSessionIdentity(): Promise<void> {
  if (sessionPromise) return sessionPromise;

  const endpoint = `${envPublic.apiBaseUrl.replace(/\/$/, '')}/auth/guest/session`;

  sessionPromise = fetch(endpoint, {
    method: 'POST',
    credentials: 'include',
    headers: { Accept: 'application/json' },
  })
    .then((response) => {
      if (!response.ok) {
        sessionPromise = null;
        throw new Error(`Failed to initialize chat session identity (${response.status})`);
      }
    })
    .catch((error) => {
      sessionPromise = null;
      throw error;
    });

  return sessionPromise;
}

export function resetChatSessionIdentity(): void {
  sessionPromise = null;
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

console.log('📋 [gameSocket] Configured for URL:', gameSocketUrl);

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
