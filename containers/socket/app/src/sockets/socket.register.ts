import type { Server } from 'socket.io';

import { registerGameSocket } from '../features/game/game.socket';
import { attachOptionalChatIdentity, requireSessionSocketAuth } from '../auth/session-auth';
import { registerFriendsSocket } from '../features/friends.socket';
import { registerChatSocket } from '../features/chat.socket';
import { registerRobotsSocket } from '../features/robots.socket';

export function registerSockets(io: Server) {
  const friendsNsp = io.of('/friends');
  const robotsNsp = io.of('/robots');
  const chatNsp = io.of('/chat');

  friendsNsp.use(requireSessionSocketAuth);
  robotsNsp.use(requireSessionSocketAuth);
  chatNsp.use(attachOptionalChatIdentity);

  registerFriendsSocket(friendsNsp);
  registerRobotsSocket(robotsNsp);
  registerChatSocket(chatNsp);
}
