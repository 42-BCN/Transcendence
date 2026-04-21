import type { Server } from 'socket.io';

import { attachOptionalChatIdentity, requireSessionSocketAuth } from '../auth/session-auth';
import { registerGameSocket } from '../features/game/game.socket';
import { registerFriendsSocket } from '../features/friends.socket';
import { registerChatSocket } from '../features/chat.socket';
import { registerRobotsSocket } from '../features/robots.socket';

export function registerSockets(io: Server) {
  const friendsNsp = io.of('/friends');
  const robotsNsp = io.of('/robots');
  const gameNsp = io.of('/game');
  const chatNsp = io.of('/chat');

  friendsNsp.use(requireSessionSocketAuth);
  robotsNsp.use(requireSessionSocketAuth);
  gameNsp.use(attachOptionalChatIdentity);
  chatNsp.use(attachOptionalChatIdentity);

  registerFriendsSocket(friendsNsp);
  registerRobotsSocket(robotsNsp);
  registerChatSocket(chatNsp);
  registerGameSocket(gameNsp);
}
