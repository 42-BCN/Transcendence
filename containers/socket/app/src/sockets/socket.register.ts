import type { Server } from 'socket.io';

import { attachOptionalChatIdentity, requireSessionSocketAuth } from '../auth/session-auth';
import { registerGameSocket } from '../features/game/game.socket';
import { registerFriendsSocket } from '../features/friends.socket';
import { registerChatSocket } from '../features/chat.socket';
import { registerGameRoomSocket } from '../features/gameRoom.socket';
import { registerRobotsSocket } from '../features/robots.socket';
import { registerDirectMessagesSocket } from '../features/direct-messages.socket';

export function registerSockets(io: Server) {
  const friendsNsp = io.of('/friends');
  const robotsNsp = io.of('/robots');
  const gameNsp = io.of('/game');
  const chatNsp = io.of('/chat');
  const gameRoomNsp = io.of('/game-room');
  const directMessagesNsp = io.of('/direct-messages');

  friendsNsp.use(requireSessionSocketAuth);
  robotsNsp.use(requireSessionSocketAuth);
  gameNsp.use(attachOptionalChatIdentity);
  chatNsp.use(attachOptionalChatIdentity);
  directMessagesNsp.use(requireSessionSocketAuth);

  registerFriendsSocket(friendsNsp);
  registerRobotsSocket(robotsNsp);
  registerChatSocket(chatNsp);
  registerGameRoomSocket(gameRoomNsp);
  registerGameSocket(gameNsp);
  registerDirectMessagesSocket(directMessagesNsp);
}
