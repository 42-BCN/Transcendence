import { io, type Socket } from 'socket.io-client';

import { envPublic } from '@/lib/config/env.public';
import type {
  ServerToClientChatEvents,
  ClientToServerChatEvents,
} from '@/contracts/sockets/chat/chat.schema';

import type {
  ServerToClientGameEvents,
  ClientToServerGameEvents,
} from '@/contracts/sockets/game/game.schema';

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
  }).then((response) => {
    if (!response.ok) {
      sessionPromise = null;
      throw new Error(`Failed to initialize chat session identity (${response.status})`);
    }
  });

  return sessionPromise;
}

const robotsSocketUrl = envPublic.socketUrl != 'https://localhost:8443' ? new URL('/robots', envPublic.socketUrl).toString() :'/robots';
const chatSocketUrl = envPublic.socketUrl != 'https://localhost:8443' ? new URL('/chat', envPublic.socketUrl).toString() :'/chat';
const gameSocketUrl = envPublic.socketUrl != 'https://localhost:8443' ? new URL('/game', envPublic.socketUrl).toString() :'/game';

export const gameSocket: Socket<ServerToClientGameEvents, ClientToServerGameEvents> = io(
  gameSocketUrl,
  {
    autoConnect: false,
    transports: ['websocket'],
    withCredentials: true,
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
  },
);

// Immediate error logging
gameSocket.on('error', (error) => {
  console.error('🔴 [gameSocket] error event:', error);
});

gameSocket.on('connect_error', (error) => {
  console.error('🔴 [gameSocket] connect_error:', error);
  if (error instanceof Error) {
    console.error('  Error message:', error.message);
    console.error('  Error stack:', error.stack);
  }
});

console.log('📋 [gameSocket] Configured for URL:', gameSocketUrl);

// Global error handlers
gameSocket.on('error', (error) => {
  console.error('🔴 gameSocket error:', error);
});

gameSocket.on('connect_error', (error) => {
  console.error('🔴 gameSocket connect_error:', error);
});

console.log('📋 gameSocket configured for URL:', gameSocketUrl);

export const robotsSocket: Socket<ServerToClientRobotsEvents, ClientToServerRobotsEvents> = io(
  robotsSocketUrl,
  {
    autoConnect: false,
    transports: ['websocket'],
    withCredentials: true,
  },
);

export const chatSocket: Socket<ServerToClientChatEvents, ClientToServerChatEvents> = io(
  chatSocketUrl,
  {
    autoConnect: false,
    transports: ['websocket'],
    withCredentials: true,
    auth: {},
  },
);
