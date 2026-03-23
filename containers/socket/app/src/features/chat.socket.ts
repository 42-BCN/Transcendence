import type { z } from 'zod';
import type { Namespace, Socket } from 'socket.io';

import { ChatSendSchema } from '../contracts/sockets/chat/chat.schema';
import type {
  ChatError,
  ChatHistoryType,
  ChatMessage,
  ChatSystemMessage,
  ClientToServerChatEvents,
  ServerToClientChatEvents,
} from '../contracts/sockets/chat/chat.schema';
import type { ValidationCode } from '../contracts/api/http/validation';

const MAX_HISTORY = 50;
const chatHistory: ChatHistoryType = [];

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
    details: error.issues.map((issue) => ({
      fieldName: issue.path.filter(
        (segment): segment is string | number =>
          typeof segment === 'string' || typeof segment === 'number',
      ),
      errCode: issue.code as ValidationCode,
    })),
  },
});

const systemMessage = (text: 'USER_JOINED' | 'USER_LEFT', username: string): ChatSystemMessage => {
  const message: ChatSystemMessage = {
    ...createBaseMessage(username),
    type: 'system',
    content: { text },
  };

  console.log(
    `[Chat Socket] System message: ${username} ${text === 'USER_JOINED' ? 'joined' : 'left'} the chat.`,
  );

  chatHistory.push(message);
  return message;
};

const chatMessage = (username: string, text: string): ChatMessage => {
  const message: ChatMessage = {
    ...createBaseMessage(username),
    type: 'user',
    username,
    content: { text },
  };

  chatHistory.push(message);
  return message;
};

// ---------------------------------------------------------------
// Message Creation Helpers END
// ---------------------------------------------------------------

export function registerChatSocket(
  nsp: Namespace<ClientToServerChatEvents, ServerToClientChatEvents>,
) {
  nsp.on('connection', (socket: Socket<ClientToServerChatEvents, ServerToClientChatEvents>) => {
    console.log('[Chat Socket] User connected:', socket.id);

    socket.emit('chat:history', chatHistory.slice(-MAX_HISTORY));
    socket.broadcast.emit('chat:system', systemMessage('USER_JOINED', socket.id));

    socket.on('chat:send', (payload: unknown) => {
      const res = ChatSendSchema.safeParse(payload);

      if (res.success) {
        socket.broadcast.emit('chat:message', chatMessage(socket.id, res.data.text));
        return;
      }

      socket.emit('chat:error', errorMessage(res.error));
    });

    socket.on('disconnect', () => {
      socket.broadcast.emit('chat:system', systemMessage('USER_LEFT', socket.id));
    });
  });
}
