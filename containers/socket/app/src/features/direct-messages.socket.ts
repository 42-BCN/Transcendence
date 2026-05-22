import { randomUUID } from 'crypto';

import type { Namespace, Socket } from 'socket.io';

import {
  DirectMessageSendSchema,
  directMessageFriendUserIdSchema,
  directMessageSocketEvents,
  type DirectMessageRead,
  type ClientToServerDirectMessageEvents,
  type DirectMessageError,
  type ServerToClientDirectMessageEvents,
} from '@contracts/sockets/direct-messages/direct-messages.schema';

import { directMessageUnreadUpdatedSocketEvent, emitToUser } from '../features/friends.socket';
import {
  fetchDirectMessageHistory,
  markDirectMessagesRead,
  sendDirectMessage,
} from '../internal/direct-messages.client';
import { fetchAcceptedFriendIds } from '../internal/friends.client';

function sortedPair(userId1: string, userId2: string): [string, string] {
  return userId1 < userId2 ? [userId1, userId2] : [userId2, userId1];
}

function roomIdForPair(userId1: string, userId2: string): string {
  const [smaller, larger] = sortedPair(userId1, userId2);
  return `dm:${smaller}:${larger}`;
}

function errorMessage(): DirectMessageError {
  return {
    id: randomUUID(),
    createdAt: Date.now(),
    senderId: randomUUID(),
    username: 'system',
    type: 'error',
    content: {
      text: 'INVALID_DIRECT_MESSAGE',
    },
  };
}

async function emitReadState(
  socket: Socket<ClientToServerDirectMessageEvents, ServerToClientDirectMessageEvents>,
  currentUserId: string,
  friendUserId: string,
): Promise<void> {
  const unreadCount = await markDirectMessagesRead({ currentUserId, friendUserId });

  if (typeof unreadCount !== 'number') return;

  emitToUser(currentUserId, directMessageUnreadUpdatedSocketEvent, {
    otherUserId: friendUserId,
    unreadMessageCount: unreadCount,
  });

  const payload: DirectMessageRead = {
    friendUserId,
    unreadCount,
  };

  socket.emit(directMessageSocketEvents.read, payload);
}

export function registerDirectMessagesSocket(
  nsp: Namespace<ClientToServerDirectMessageEvents, ServerToClientDirectMessageEvents>,
) {
  nsp.on(
    'connection',
    async (
      socket: Socket<ClientToServerDirectMessageEvents, ServerToClientDirectMessageEvents>,
    ) => {
      const currentUserId = socket.data.userId;
      const friendUserIdResult = directMessageFriendUserIdSchema.safeParse(
        socket.handshake.auth?.friendUserId,
      );

      if (typeof currentUserId !== 'string' || currentUserId.length === 0) {
        socket.disconnect(true);
        return;
      }

      if (!friendUserIdResult.success || friendUserIdResult.data === currentUserId) {
        socket.disconnect(true);
        return;
      }

      const acceptedFriendIds = await fetchAcceptedFriendIds(currentUserId);

      if (!acceptedFriendIds.includes(friendUserIdResult.data)) {
        socket.disconnect(true);
        return;
      }

      const roomId = roomIdForPair(currentUserId, friendUserIdResult.data);
      await socket.join(roomId);

      socket.on(directMessageSocketEvents.send, async (payload: unknown) => {
        const parsed = DirectMessageSendSchema.safeParse(payload);

        if (!parsed.success) {
          socket.emit(directMessageSocketEvents.error, errorMessage());
          return;
        }

        const saved = await sendDirectMessage({
          currentUserId,
          friendUserId: friendUserIdResult.data,
          text: parsed.data.text,
        });

        if (!saved) {
          socket.emit(directMessageSocketEvents.error, errorMessage());
          return;
        }

        emitToUser(friendUserIdResult.data, directMessageUnreadUpdatedSocketEvent, {
          otherUserId: currentUserId,
          unreadMessageCount: saved.unreadCount,
        });

        nsp.to(roomId).emit(directMessageSocketEvents.message, {
          ...saved.message,
          clientMessageId: parsed.data.clientMessageId,
        });
      });

      socket.on(directMessageSocketEvents.read, async () => {
        await emitReadState(socket, currentUserId, friendUserIdResult.data);
      });

      const historyRows = await fetchDirectMessageHistory({
        currentUserId,
        friendUserId: friendUserIdResult.data,
      });

      socket.emit(directMessageSocketEvents.history, historyRows);
      await emitReadState(socket, currentUserId, friendUserIdResult.data);
    },
  );
}
