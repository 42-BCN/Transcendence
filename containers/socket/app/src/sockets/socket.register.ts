import type { Server } from 'socket.io';

import { registerRobotsSocket } from '../features/robots.socket';
import { registerChatSocket } from '../features/chat.socket';

export function registerSockets(io: Server) {
  registerRobotsSocket(io.of('/robots'));
  registerChatSocket(io.of('/chat'));
}
