import type { Server } from 'socket.io';

import { registerGameSocket } from '../features/game.socket';
import { registerFriendsSocket } from '../features/friends.socket';
import { registerChatSocket } from '../features/chat.socket';
import { registerRobotsSocket } from '../features/robots.socket';

export function registerSockets(io: Server) {
  registerFriendsSocket(io);
  registerRobotsSocket(io.of('/robots'));
  registerGameSocket(io.of('/game'));
  registerChatSocket(io.of('/chat'));
}
