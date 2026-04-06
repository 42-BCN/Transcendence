// @ts-nocheck
import type { z } from 'zod';
import type { Namespace, Socket } from 'socket.io';

import { GameSendSchema } from '../../../../contracts/sockets/game/game.schema';
import { ChatSendSchema } from '../../../../contracts/sockets/chat/chat.schema';
import type { ValidationCode } from '../../../../contracts/api/http/validation';

// TODO:
// primero importa tipos del esquema, define variables globales,
// crea unos helpers para la creacion del mensaje y el propio
// registerChatSocket function donde maneja socket.on

import type { } from '../../../../contracts/sockets/game/game.schema';

const playerids: string[] = ['assassin', 'paladin', 'mage', 'alchemist'].reverse();
const users: Record<string, string> = {};

export function registerGameSocket(
  nsp: Namespace<ClientToServerGameEvents, ServerToClientGameEvents>
) {
  nsp.on('connection', (socket: Socket<ClientToServerGameEvents, ServerToClientGameEvents>) => {
    if (playerids.length === 0) {
      console.log("Room full, spectator joined:", socket.id);
      return;
    }
    users[socket.id] = playerids.pop();
    console.log(socket.id, " joined with ", users[socket.id]);
    socket.on('testEvent', (payload: unknown) => {
      socket.emit('message', "epa");
    })
    socket.on('disconnect', () => {
      const free = users[socket.id];
      if (free) {
        playerids.push(free);
        delete users[socket.id];
        console.log(freedRole, " disconnected, role is available again.");
      }
    })
  })
}

// socket.emit('chat:history', chatHistory.slice(-MAX_HISTORY));
// socket.broadcast.emit('chat:system', systemMessage('USER_JOINED', socket.id));
//
// socket.on('chat:send', (payload: unknown) => {
//   const res = ChatSendSchema.safeParse(payload);
//
//   if (res.success) {
//     socket.broadcast.emit('chat:message', chatMessage(socket.id, res.data.text));
//     return;
//   }
//
//   socket.emit('chat:error', errorMessage(res.error));
// });
//
// socket.on('disconnect', () => {
//   socket.broadcast.emit('chat:system', systemMessage('USER_LEFT', socket.id));
// });

// const MAX_HISTORY = 50;
// const chatHistory: ChatHistoryType = [];

// const pushChatHistory = (message: ChatHistoryType[number]) => {
//   chatHistory.push(message);
//
//   if (chatHistory.length > MAX_HISTORY) {
//     chatHistory.shift();
//   }
// };

// ---------------------------------------------------------------
// Message Creation Helpers START
// ---------------------------------------------------------------
//
// const createBaseMessage = (username?: string) => ({
//   id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
//   createdAt: Date.now(),
//   ...(username ? { username } : {}),
// });
//
// const errorMessage = (error: z.ZodError): ChatError => ({
//   ...createBaseMessage(),
//   type: 'error',
//   content: {
//     text: 'INVALID_CHAT_MESSAGE',
//   },
// });
//
// const systemMessage = (text: 'USER_JOINED' | 'USER_LEFT', username: string): ChatSystemMessage => {
//   const message: ChatSystemMessage = {
//     ...createBaseMessage(username),
//     type: 'system',
//     content: { text },
//   };
//
//   console.log(
//     `[Chat Socket] System message: ${username} ${text === 'USER_JOINED' ? 'joined' : 'left'} the chat.`,
//   );
//
//   pushChatHistory(message);
//   return message;
// };
//
// const chatMessage = (username: string, text: string): ChatMessage => {
//   const message: ChatMessage = {
//     ...createBaseMessage(username),
//     type: 'user',
//     username,
//     content: { text },
//   };
//
//   pushChatHistory(message);
//   return message;
// };
//
// // ---------------------------------------------------------------
// // Message Creation Helpers END
// // ---------------------------------------------------------------
//
