import type { Server } from 'socket.io';

import { registerRobotsSocket } from '../features/robots.socket';
import { registerGameSocket } from '../features/robots.socket';
import { registerChatSocket } from '../features/chat.socket';

export function registerSockets(io: Server) {
  registerRobotsSocket(io.of('/robots'));
  registerGameSocket(io.of('/game'));
  registerChatSocket(io.of('/chat'));
}
