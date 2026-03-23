import { io, type Socket } from 'socket.io-client';

import type {
  ServerToClientChatEvents,
  ClientToServerChatEvents,
} from '@/contracts/sockets/chat/chat.schema';
// TODO socket url as env variable

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

export const robotsSocket: Socket<ServerToClientRobotsEvents, ClientToServerRobotsEvents> = io(
  'http://localhost:3100/robots',
  {
    autoConnect: false,
  },
);

export const chatSocket: Socket<ServerToClientChatEvents, ClientToServerChatEvents> = io(
  'http://localhost:3100/chat',
  {
    autoConnect: false,
  },
);
