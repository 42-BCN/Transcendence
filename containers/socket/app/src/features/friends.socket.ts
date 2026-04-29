import type { Namespace, Socket } from 'socket.io';

import {
  FriendAcceptedNotificationPayloadSchema,
  FriendRejectedNotificationPayloadSchema,
  FriendRequestNotificationPayloadSchema,
  friendshipSocketEvents,
  friendshipSocketUserIdSchema,
  presenceSocketEvents,
  type ClientToServerFriendshipEvents,
  type FriendshipSocketEvent,
  type FriendshipSocketPayloadByEvent,
  type ServerToClientFriendshipEvents,
} from '@contracts/sockets/friendships/friendships.schema';
import { logEvents } from '../socket.logs';
import { fetchAcceptedFriendIds } from '../internal/friends.client';

let friendsNsp: Namespace<ClientToServerFriendshipEvents, ServerToClientFriendshipEvents> | null =
  null;

/** userId -> number of active /friends connections */
const onlineCounts = new Map<string, number>();

/** userId -> current presence state */
const userStates = new Map<string, 'online' | 'away'>();

/** userId -> username (cached from socket.data on first connection) */
const usernames = new Map<string, string>();

export function registerFriendsSocket(
  nsp: Namespace<ClientToServerFriendshipEvents, ServerToClientFriendshipEvents>,
) {
  friendsNsp = nsp;

  nsp.on(
    'connection',
    (socket: Socket<ClientToServerFriendshipEvents, ServerToClientFriendshipEvents>) => {
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
      const username: string = socket.data.username ?? 'unknown';

      const wasOffline = (onlineCounts.get(currentUserId) ?? 0) === 0;
      incrementOnline(currentUserId);
      usernames.set(currentUserId, username);

      void socket.join(`user:${currentUserId}`);

      logEvents.info({
        event: 'friends_socket_connected',
        userId: currentUserId,
        socketId: socket.id,
      });

      void setupPresenceForSocket(socket, currentUserId, username, wasOffline).catch(
        (error: unknown) => {
          logEvents.error({
            event: 'setup_presence_for_socket_failed',
            userId: currentUserId,
            socketId: socket.id,
            error,
          });
        },
      );

      socket.on(presenceSocketEvents.away, () => {
        userStates.set(currentUserId, 'away');
        friendsNsp?.to(`status:${currentUserId}`).emit(presenceSocketEvents.away, {
          userId: currentUserId,
        });
        logEvents.info({ event: 'presence_away', userId: currentUserId });
      });

      socket.on(presenceSocketEvents.active, () => {
        userStates.set(currentUserId, 'online');
        friendsNsp?.to(`status:${currentUserId}`).emit(presenceSocketEvents.online, {
          userId: currentUserId,
          username,
        });
        logEvents.info({ event: 'presence_active', userId: currentUserId });
      });

      socket.on('disconnect', () => {
        decrementOnline(currentUserId);
        const isNowOffline = (onlineCounts.get(currentUserId) ?? 0) === 0;

        if (isNowOffline) {
          userStates.delete(currentUserId);
          usernames.delete(currentUserId);
          friendsNsp?.to(`status:${currentUserId}`).emit(presenceSocketEvents.offline, {
            userId: currentUserId,
          });
          logEvents.info({ event: 'presence_offline', userId: currentUserId });
        }

        logEvents.info({
          event: 'friends_socket_disconnected',
          userId: currentUserId,
          socketId: socket.id,
        });
      });
    },
  );
}

async function setupPresenceForSocket(
  socket: Socket<ClientToServerFriendshipEvents, ServerToClientFriendshipEvents>,
  currentUserId: string,
  username: string,
  wasOffline: boolean,
): Promise<void> {
  const friendIds = await fetchAcceptedFriendIds(currentUserId);

  for (const friendId of friendIds) {
    void socket.join(`status:${friendId}`);
  }

  if (wasOffline) {
    userStates.set(currentUserId, 'online');
    friendsNsp?.to(`status:${currentUserId}`).emit(presenceSocketEvents.online, {
      userId: currentUserId,
      username,
    });
  }

  for (const friendId of friendIds) {
    const count = onlineCounts.get(friendId) ?? 0;
    if (count > 0) {
      const state = userStates.get(friendId) ?? 'online';
      const friendUsername = usernames.get(friendId) ?? 'unknown';
      if (state === 'away') {
        socket.emit(presenceSocketEvents.away, { userId: friendId });
      } else {
        socket.emit(presenceSocketEvents.online, {
          userId: friendId,
          username: friendUsername,
        });
      }
    }
  }
}

/**
 * Subscribe a user's sockets to a new friend's status room.
 * Called when a friendship is accepted so both sides start receiving presence.
 */
export function subscribeUserToFriendStatus(userId: string, friendId: string): void {
  if (!friendsNsp) return;

  const userRoom = `user:${userId}`;
  const friendStatusRoom = `status:${friendId}`;

  friendsNsp.in(userRoom).socketsJoin(friendStatusRoom);

  const friendCount = onlineCounts.get(friendId) ?? 0;
  if (friendCount > 0) {
    const state = userStates.get(friendId) ?? 'online';
    const friendUsername = usernames.get(friendId) ?? 'unknown';
    if (state === 'away') {
      friendsNsp.to(userRoom).emit(presenceSocketEvents.away, { userId: friendId });
    } else {
      friendsNsp.to(userRoom).emit(presenceSocketEvents.online, {
        userId: friendId,
        username: friendUsername,
      });
    }
  }
}

function incrementOnline(userId: string) {
  onlineCounts.set(userId, (onlineCounts.get(userId) ?? 0) + 1);
}

function decrementOnline(userId: string) {
  const next = (onlineCounts.get(userId) ?? 1) - 1;
  if (next <= 0) onlineCounts.delete(userId);
  else onlineCounts.set(userId, next);
}

export function emitToUser(
  userId: string,
  event: typeof friendshipSocketEvents.request,
  payload: FriendshipSocketPayloadByEvent[typeof friendshipSocketEvents.request],
): void;
export function emitToUser(
  userId: string,
  event: typeof friendshipSocketEvents.accepted,
  payload: FriendshipSocketPayloadByEvent[typeof friendshipSocketEvents.accepted],
): void;
export function emitToUser(
  userId: string,
  event: typeof friendshipSocketEvents.rejected,
  payload: FriendshipSocketPayloadByEvent[typeof friendshipSocketEvents.rejected],
): void;
export function emitToUser(
  userId: string,
  event: FriendshipSocketEvent,
  payload: FriendshipSocketPayloadByEvent[FriendshipSocketEvent],
): void {
  const parsedUserId = friendshipSocketUserIdSchema.safeParse(userId);

  if (!parsedUserId.success) {
    logEvents.error({
      event: 'friends_socket_emit_validation_failed',
      socketEvent: event,
      reason: 'invalid_user_id',
      errors: parsedUserId.error.flatten(),
    });
    return;
  }

  switch (event) {
    case friendshipSocketEvents.request: {
      const parsedPayload = FriendRequestNotificationPayloadSchema.safeParse(payload);

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

      friendsNsp
        ?.to(`user:${parsedUserId.data}`)
        .emit(friendshipSocketEvents.request, parsedPayload.data);
      break;
    }

    case friendshipSocketEvents.accepted: {
      const parsedPayload = FriendAcceptedNotificationPayloadSchema.safeParse(payload);

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

      friendsNsp
        ?.to(`user:${parsedUserId.data}`)
        .emit(friendshipSocketEvents.accepted, parsedPayload.data);
      break;
    }

    case friendshipSocketEvents.rejected: {
      const parsedPayload = FriendRejectedNotificationPayloadSchema.safeParse(payload);

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

      friendsNsp
        ?.to(`user:${parsedUserId.data}`)
        .emit(friendshipSocketEvents.rejected, parsedPayload.data);
      break;
    }
  }

  logEvents.info({
    event: 'friends_socket_emit',
    socketEvent: event,
    userId: parsedUserId.data,
  });
}

export function getUsersOnlineStatus(userIds: string[]): Record<string, boolean> {
  const status: Record<string, boolean> = {};
  for (const id of userIds) {
    status[id] = (onlineCounts.get(id) ?? 0) > 0;
  }
  return status;
}
