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

export async function ensureChatSessionIdentity(): Promise<void> {
  const endpoint = `${envPublic.apiBaseUrl.replace(/\/$/, '')}/auth/guest/session`;

  const response = await fetch(endpoint, {
    method: 'POST',
    credentials: 'include',
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to initialize chat session identity (${response.status})`);
  }
}

const robotsSocketUrl = new URL('/robots', envPublic.socketUrl).toString();
const chatSocketUrl = new URL('/chat', envPublic.socketUrl).toString();
const gameSocketUrl = new URL('/game', envPublic.socketUrl).toString();

export const gameSocket: Socket<ServerToClientGameEvents, ClientToServerGameEvents> = io(
  gameSocketUrl,
  {
    autoConnect: false,
    transports: ['websocket'],
    withCredentials: true,
  },
);

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
