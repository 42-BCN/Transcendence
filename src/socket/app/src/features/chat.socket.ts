import type { z } from 'zod';
import type { Namespace, Socket } from 'socket.io';

import { ChatSendSchema } from '@contracts/sockets/chat/chat.schema';
import type {
  ChatError,
  ChatMessage,
  ChatSystemMessage,
} from '@contracts/sockets/chat/chat.schema';
import type { ValidationCode } from '@contracts/api/http/validation';

type ClientToServerEvents = {
  'chat:send': (payload: unknown) => void;
};

type ServerToClientEvents = {
  'chat:message': (payload: ChatMessage) => void;
  'chat:system': (payload: ChatSystemMessage) => void;
  'chat:error': (payload: ChatError) => void;
};

const errorMessage = (error: z.ZodError): ChatError => ({
  code: 'INVALID_CHAT_MESSAGE',
  details: error.issues.map((issue) => ({
    fieldName: issue.path,
    errCode: issue.code as ValidationCode,
  })),
});

const systemMessage = (type: 'USER_JOINED' | 'USER_LEFT', username: string): ChatSystemMessage => ({
  username,
  type,
  createdAt: Date.now(),
});

const chatMessage: (username: string, text: string) => ChatMessage = (username, text) => ({
  username,
  content: {
    text,
  },
  createdAt: Date.now(),
});

export function registerChatSocket(nsp: Namespace<ClientToServerEvents, ServerToClientEvents>) {
  nsp.on('connection', (socket: Socket<ClientToServerEvents, ServerToClientEvents>) => {
    console.log('[Chat Socket] User connected:', socket.id);
    const username = `User-${socket.id.slice(0, 5)}`;
    socket.broadcast.emit('chat:system', systemMessage('USER_JOINED', username));

    socket.on('chat:send', (payload) => {
      const res = ChatSendSchema.safeParse(payload);
      !res.success
        ? socket.emit('chat:error', errorMessage(res.error))
        : socket.broadcast.emit('chat:message', chatMessage(username, res.data.text));
    });

    socket.on('disconnect', () => {
      const username = `User-${socket.id.slice(0, 5)}`;
      console.log('[Chat Socket] User disconnected:', socket.id);
      socket.broadcast.emit('chat:system', systemMessage('USER_LEFT', username));
    });
  });
}
