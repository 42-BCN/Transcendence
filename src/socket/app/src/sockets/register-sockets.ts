import type { Server } from 'socket.io';
import { registerRobotsSocket } from '../features/robots.socket';

export function registerSockets(io: Server) {
  registerRobotsSocket(io.of('/robots'));
}
