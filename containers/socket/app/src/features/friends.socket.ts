import type { Namespace, Socket } from 'socket.io';

import {
  friendshipSocketPayloadSchemas,
  friendshipSocketUserIdSchema,
  type FriendshipSocketEvent,
  type FriendshipSocketPayloadByEvent,
  type ServerToClientFriendshipEvents,
} from '../contracts/sockets/friendships/friendships.schema';
import { logEvents } from '../socket.logs';

type ClientToServerFriendshipEvents = Record<string, never>;

let friendsNsp: Namespace<ClientToServerFriendshipEvents, ServerToClientFriendshipEvents> | null =
  null;

/** userId -> number of active /friends connections that identified as that user */
const onlineCounts = new Map<string, number>();

export function registerFriendsSocket(
  nsp: Namespace<ClientToServerFriendshipEvents, ServerToClientFriendshipEvents>,
) {
  friendsNsp = nsp;

  nsp.on(
    'connection',
    (
      socket: Socket<ClientToServerFriendshipEvents, ServerToClientFriendshipEvents>,
    ) => {
      const parsedUserId = friendshipSocketUserIdSchema.safeParse(socket.data.userId);

      if (!parsedUserId.success) {
        logEvents.warn({
          event: 'friends_socket_connection_rejected',
          reason: 'invalid_user_id',
          errors: parsedUserId.error.flatten(),
        });
        socket.disconnect(true);
        return;
      }

      const currentUserId = parsedUserId.data;

      incrementOnline(currentUserId);
      void socket.join(`user:${currentUserId}`);
      logEvents.info({
        event: 'friends_socket_connected',
        userId: currentUserId,
        socketId: socket.id,
      });

      socket.on('disconnect', () => {
        decrementOnline(currentUserId);
        logEvents.info({
          event: 'friends_socket_disconnected',
          userId: currentUserId,
          socketId: socket.id,
        });
      });
    },
  );
}

function incrementOnline(userId: string) {
  onlineCounts.set(userId, (onlineCounts.get(userId) ?? 0) + 1);
}

function decrementOnline(userId: string) {
  const next = (onlineCounts.get(userId) ?? 1) - 1;
  if (next <= 0) onlineCounts.delete(userId);
  else onlineCounts.set(userId, next);
}

export function emitToUser<TEvent extends FriendshipSocketEvent>(
  userId: string,
  event: TEvent,
  payload: FriendshipSocketPayloadByEvent[TEvent],
): void {
  const parsedUserId = friendshipSocketUserIdSchema.safeParse(userId);
  const parsedPayload = friendshipSocketPayloadSchemas[event].safeParse(payload);

  if (!parsedUserId.success) {
    logEvents.error({
      event: 'friends_socket_emit_validation_failed',
      socketEvent: event,
      reason: 'invalid_user_id',
      errors: parsedUserId.error.flatten(),
    });
    return;
  }

  if (!parsedPayload.success) {
    logEvents.error({
      event: 'friends_socket_emit_validation_failed',
      socketEvent: event,
      userId: parsedUserId.data,
      reason: 'invalid_payload',
      errors: parsedPayload.error.flatten(),
    });
    return;
  }

  logEvents.info({
    event: 'friends_socket_emit',
    socketEvent: event,
    userId: parsedUserId.data,
  });
  friendsNsp?.to(`user:${parsedUserId.data}`).emit(event, parsedPayload.data);
}

export function getUsersOnlineStatus(userIds: string[]): Record<string, boolean> {
  const status: Record<string, boolean> = {};
  for (const id of userIds) {
    status[id] = (onlineCounts.get(id) ?? 0) > 0;
  }
  return status;
}
