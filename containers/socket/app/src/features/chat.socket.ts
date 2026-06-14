import type { z } from 'zod';
import type { Namespace, Socket } from 'socket.io';

import { ChatSendSchema } from '@contracts/sockets/chat/chat.schema';
import type {
  ChatError,
  ChatIdentity,
  ChatHistoryType,
  ChatMessage,
  ChatSystemMessage,
  ClientToServerChatEvents,
  ServerToClientChatEvents,
} from '@contracts/sockets/chat/chat.schema';
import { getUserGameRoomChannel } from './game-room/gameRooms.shared';

const MAX_HISTORY = 50;
const roomChatHistory = new Map<string, ChatHistoryType>();
const roomChatIdentityCounts = new Map<string, Map<string, number>>();

const getChatHistory = (roomName: string): ChatHistoryType => {
  const history = roomChatHistory.get(roomName);
  if (history) {
    return history;
  }

  const nextHistory: ChatHistoryType = [];
  roomChatHistory.set(roomName, nextHistory);
  return nextHistory;
};

const getRoomIdentityCounts = (roomName: string) => {
  const roomCounts = roomChatIdentityCounts.get(roomName);
  if (roomCounts) {
    return roomCounts;
  }

  const nextCounts = new Map<string, number>();
  roomChatIdentityCounts.set(roomName, nextCounts);
  return nextCounts;
};

const pushChatHistory = (roomName: string, message: ChatHistoryType[number]) => {
  const chatHistory = getChatHistory(roomName);
  chatHistory.push(message);

  if (chatHistory.length > MAX_HISTORY) {
    chatHistory.shift();
  }
};

// ---------------------------------------------------------------
// Message Creation Helpers START
// ---------------------------------------------------------------

const createBaseMessage = (username?: string) => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
  createdAt: Date.now(),
  ...(username ? { username } : {}),
});

const errorMessage = (error: z.ZodError): ChatError => ({
  ...createBaseMessage(),
  type: 'error',
  content: {
    text: 'INVALID_CHAT_MESSAGE',
  },
});

const systemMessage = (
  roomName: string,
  text: 'USER_JOINED' | 'USER_LEFT',
  username: string,
): ChatSystemMessage => {
  const message: ChatSystemMessage = {
    ...createBaseMessage(username),
    type: 'system',
    content: { text },
  };

  console.log(
    `[Chat Socket] System message: ${username} ${text === 'USER_JOINED' ? 'joined' : 'left'} the chat.`,
  );

  pushChatHistory(roomName, message);
  return message;
};

const chatMessage = (roomName: string, username: string, text: string): ChatMessage => {
  const message: ChatMessage = {
    ...createBaseMessage(username),
    type: 'user',
    username,
    content: { text },
  };

  pushChatHistory(roomName, message);
  return message;
};

// ---------------------------------------------------------------
// Message Creation Helpers END
// ---------------------------------------------------------------

export function registerChatSocket(
  nsp: Namespace<ClientToServerChatEvents, ServerToClientChatEvents>,
) {
  nsp.on('connection', (socket: Socket<ClientToServerChatEvents, ServerToClientChatEvents>) => {
    const identityKey = socket.data.identityKey;
    const username = socket.data.username;
    const roomName = getUserGameRoomChannel(socket);

    if (typeof identityKey !== 'string' || identityKey.length === 0) {
      socket.disconnect(true);
      return;
    }

    if (typeof username !== 'string' || username.length === 0) {
      socket.disconnect(true);
      return;
    }

    if (!roomName) {
      socket.emit('chat:error', {
        ...createBaseMessage(),
        type: 'error',
        content: { text: 'INVALID_CHAT_MESSAGE' },
      });
      socket.disconnect(true);
      return;
    }

    socket.join(roomName);

    const identity: ChatIdentity = {
      identityKey,
      username,
      isGuest: socket.data.isGuest !== false,
      ...(typeof socket.data.userId === 'string' ? { userId: socket.data.userId } : {}),
    };

    const chatIdentityCounts = getRoomIdentityCounts(roomName);
    const previousCount = chatIdentityCounts.get(identityKey) ?? 0;
    chatIdentityCounts.set(identityKey, previousCount + 1);

    console.log('[Chat Socket] User connected:', username);
    socket.emit('chat:identity', identity);
    socket.emit('chat:history', getChatHistory(roomName).slice(-MAX_HISTORY));
    if (previousCount === 0) {
      socket.to(roomName).emit('chat:system', systemMessage(roomName, 'USER_JOINED', username));
    }

    socket.on('chat:send', (payload: unknown) => {
      const res = ChatSendSchema.safeParse(payload);

      if (res.success) {
        socket.to(roomName).emit('chat:message', chatMessage(roomName, username, res.data.text));
        return;
      }

      socket.emit('chat:error', errorMessage(res.error));
    });

    socket.on('disconnect', () => {
      const nextCount = (chatIdentityCounts.get(identityKey) ?? 1) - 1;

      if (nextCount <= 0) {
        chatIdentityCounts.delete(identityKey);
        socket.to(roomName).emit('chat:system', systemMessage(roomName, 'USER_LEFT', username));
      } else {
        chatIdentityCounts.set(identityKey, nextCount);
      }
    });
  });
}
