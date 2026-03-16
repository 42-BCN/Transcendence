import type { Namespace, Socket } from 'socket.io';
import { type ChatMessage, ChatSendSchema } from '@contracts/chat/chat.schema';

type ClientToServerEvents = {
  'chat:send': (payload: unknown) => void;
};

type ServerToClientEvents = {
  'chat:message': (payload: ChatMessage) => void;
  'chat:error': (payload: { code: string; message: string }) => void;
};

export function registerChatSocket(nsp: Namespace<ClientToServerEvents, ServerToClientEvents>) {
  nsp.on('connection', (socket: Socket) => {
    console.log('[chat] Client connected:', socket.id);

    socket.on('chat:send', (payload: unknown) => {
      const parsed = ChatSendSchema.parse(payload);
      console.log(parsed);
    });
  });
}
