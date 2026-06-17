import type { Server } from 'socket.io';

import { attachOptionalChatIdentity, requireSessionSocketAuth } from '../auth/session-auth';
import { registerGameSocket } from '../features/game/game.socket';
import { registerFriendsSocket } from '../features/friends.socket';
import { registerChatSocket } from '../features/chat.socket';
import { registerGameRoomSocket } from '../features/game-room/gameRoom.socket';
import { registerRobotsSocket } from '../features/robots.socket';
import { registerDirectMessagesSocket } from '../features/direct-messages.socket';

const authenticatedNamespaces = new Set<string>();
let socketServer: Server | null = null;

export function registerSockets(io: Server) {
  socketServer = io;
  const friendsNsp = io.of('/friends');
  const robotsNsp = io.of('/robots');
  const gameNsp = io.of('/game');
  const chatNsp = io.of('/chat');
  const gameRoomNsp = io.of('/game-room');
  const directMessagesNsp = io.of('/direct-messages');

  friendsNsp.use(requireSessionSocketAuth);
  robotsNsp.use(requireSessionSocketAuth);
  gameNsp.use(attachOptionalChatIdentity);
  gameRoomNsp.use(attachOptionalChatIdentity);
  chatNsp.use(attachOptionalChatIdentity);
  directMessagesNsp.use(requireSessionSocketAuth);

  registerFriendsSocket(friendsNsp);
  registerRobotsSocket(robotsNsp);
  registerChatSocket(chatNsp);
  registerGameSocket(gameNsp);
  registerGameRoomSocket(gameRoomNsp);
  registerDirectMessagesSocket(directMessagesNsp);

  authenticatedNamespaces.clear();
  authenticatedNamespaces.add('/friends');
  authenticatedNamespaces.add('/robots');
  authenticatedNamespaces.add('/game');
  authenticatedNamespaces.add('/chat');
  authenticatedNamespaces.add('/game-room');
  authenticatedNamespaces.add('/direct-messages');
}

export function disconnectAuthenticatedSessionSockets(userId: string, sessionId: string): number {
  if (!socketServer) {
    return 0;
  }

  let disconnectedCount = 0;

  for (const namespaceName of authenticatedNamespaces) {
    const namespace = socketServer.of(namespaceName);

    for (const socket of Array.from(namespace.sockets.values())) {
      if (
        socket.data.userId !== userId
        || socket.data.sessionId !== sessionId
        || socket.data.isGuest !== false
      ) {
        continue;
      }

      disconnectedCount += 1;
      socket.disconnect(true);
    }
  }

  return disconnectedCount;
}
