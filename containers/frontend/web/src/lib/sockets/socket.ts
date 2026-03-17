import { io, type Socket } from 'socket.io-client';

// TODO socket url as env variable

export type Robot = {
  id: string;
  position: [number, number, number];
  color: string;
};

type ServerToClientEvents = {
  robots: (robots: Robot[]) => void;
};

type ClientToServerEvents = {
  moveTo: (target: [number, number, number]) => void;
};

export const robotsSocket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  'http://localhost:3100/robots',
  {
    autoConnect: false,
  },
);
