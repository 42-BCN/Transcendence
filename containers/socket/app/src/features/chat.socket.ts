import type { z } from 'zod';
import type { Namespace, Socket } from 'socket.io';

import { ChatSendSchema } from '../contracts/sockets/chat/chat.schema';
import type {
  ChatError,
  ChatMessage,
  ChatSystemMessage,
  ChatMessageUnion,
} from '../contracts/sockets/chat/chat.schema';
import type { ValidationCode } from '../contracts/api/http/validation';

const MAX_HISTORY = 50;
const chatHistory: ChatMessageUnion[] = [];

type ClientToServerEvents = {
  'chat:send': (payload: unknown) => void;
};

type ServerToClientEvents = {
  'chat:message': (payload: ChatMessage) => void;
  'chat:system': (payload: ChatSystemMessage) => void;
  'chat:error': (payload: ChatError) => void;
  'chat:history': (payload: ChatMessageUnion[]) => void;
};

const errorMessage = (error: z.ZodError): ChatError => ({
  type: 'error',
  content: {
    text: 'INVALID_CHAT_MESSAGE',
    details: error.issues.map((issue) => ({
      fieldName: issue.path,
      errCode: issue.code as ValidationCode,
    })),
  },
  id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
  createdAt: Date.now(),
});

const systemMessage = (text: 'USER_JOINED' | 'USER_LEFT', username: string): ChatSystemMessage => {
  const message: ChatSystemMessage = {
    type: 'system',
    username,
    content: {
      text,
    },
    createdAt: Date.now(),
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
  };
  console.log(
    `[Chat Socket] System message: ${username} ${text === 'USER_JOINED' ? 'joined' : 'left'} the chat.`,
  );
  chatHistory.push(message);
  return message;
};

const chatMessage = (username: string, text: string): ChatMessage => {
  const message: ChatMessage = {
    type: 'user',
    username,
    content: {
      text,
    },
    createdAt: Date.now(),
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
  };
  chatHistory.push(message);
  return message;
};

export function registerChatSocket(nsp: Namespace<ClientToServerEvents, ServerToClientEvents>) {
  nsp.on('connection', (socket: Socket<ClientToServerEvents, ServerToClientEvents>) => {
    console.log('[Chat Socket] User connected:', socket.id);

    socket.emit('chat:history', chatHistory.slice(-MAX_HISTORY));
    socket.broadcast.emit('chat:system', systemMessage('USER_JOINED', socket.id));

    socket.on('chat:send', (payload: unknown) => {
      const res = ChatSendSchema.safeParse(payload);
      res.success
        ? socket.broadcast.emit('chat:message', chatMessage(socket.id, res.data.text))
        : socket.emit('chat:error', errorMessage(res.error));
    });

    socket.on('disconnect', () =>
      socket.broadcast.emit('chat:system', systemMessage('USER_LEFT', socket.id)),
    );
  });
}
