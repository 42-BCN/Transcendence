import type { Namespace, Socket } from 'socket.io';
import type { gameRoomState } from '@contracts/sockets/rooms/gameRooms.schema';

import {
  cancelPendingGameRoomRemoval,
  decrementGameRoomConnection,
  gameRoomsManager,
  getPreviousRoomMemberKey,
  getRoomMemberKey,
  incrementGameRoomConnection,
  scheduleGameRoomRemoval,
} from './gameRooms.shared';

const processEnv = globalThis as typeof globalThis & {
  process?: { env?: Record<string, string | undefined> };
};
const BACKEND_URL = processEnv.process?.env?.BACKEND_URL ?? 'https://backend:4000';

function notifyPendingInvitees(userId: string): void {
  const secret = processEnv.process?.env?.SOCKET_INTERNAL_SECRET;
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (secret) headers['x-internal-secret'] = secret;

  void fetch(`${BACKEND_URL}/internal/game-invitations/notify-invitees`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ userId }),
  }).catch(() => undefined);
}

function markJoinedRoom(userId: string, roomId: number): void {
  const secret = processEnv.process?.env?.SOCKET_INTERNAL_SECRET;
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (secret) headers['x-internal-secret'] = secret;

  void fetch(`${BACKEND_URL}/internal/game-invitations/mark-joined`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ userId, roomId }),
  }).catch(() => undefined);
}

type EmptyGameRoomState = {
  id: 0;
  isGameRoomFull: false;
  teammates: [];
};

const EMPTY_GAME_ROOM_STATE: EmptyGameRoomState = {
  id: 0,
  isGameRoomFull: false,
  teammates: [],
};

let gameRoomNamespace: Namespace | null = null;

export function getGameRoomChannel(gameRoomId: number) {
  return `GameRoom-${gameRoomId}`;
}

function getGameRoomMemberChannel(memberKey: string) {
  return `GameRoomMember-${memberKey}`;
}

function emitEmptyGameRoomState(socket: Socket) {
  socket.nsp.to(socket.id).emit('gameRoom:room:update', EMPTY_GAME_ROOM_STATE);
}

function emitGameRoomError(socket: Socket, message: string) {
  socket.nsp.to(socket.id).emit('gameRoom:error:msg', message);
}

export function emitGameRoomStateToMember(memberKey: string, gameRoom: gameRoomState) {
  gameRoomNamespace?.to(getGameRoomMemberChannel(memberKey)).emit('gameRoom:room:update', gameRoom);
}

export function emitGameRoomErrorToMember(memberKey: string, message: string) {
  gameRoomNamespace?.to(getGameRoomMemberChannel(memberKey)).emit('gameRoom:error:msg', message);
}

export function broadcastGameRoomState(gameRoomId: number, gameRoom: gameRoomState) {
  gameRoomNamespace?.to(getGameRoomChannel(gameRoomId)).emit('gameRoom:room:update', gameRoom);
}

export function emitGameRoomJoined(gameRoomId: number, username: string) {
  gameRoomNamespace?.to(getGameRoomChannel(gameRoomId)).emit('gameRoom:room:joined', username);
}

export function subscribeMemberToGameRoomChannel(memberKey: string, gameRoomId: number) {
  void gameRoomNamespace
    ?.in(getGameRoomMemberChannel(memberKey))
    .socketsJoin(getGameRoomChannel(gameRoomId));
}

export function unsubscribeMemberFromGameRoomChannel(memberKey: string, gameRoomId: number) {
  void gameRoomNamespace
    ?.in(getGameRoomMemberChannel(memberKey))
    .socketsLeave(getGameRoomChannel(gameRoomId));
}

function updateGameRoomState(socket: Socket) {
  const roomMemberKey = getRoomMemberKey(socket);
  if (!roomMemberKey) {
    emitEmptyGameRoomState(socket);
    return;
  }

  const gameRoom = gameRoomsManager.getUserCurrentGameRoom(roomMemberKey);
  if (gameRoom === 'error:no_assigned_room') {
    emitEmptyGameRoomState(socket);
    return;
  }

  socket.nsp.to(socket.id).emit('gameRoom:room:update', gameRoom);
  void socket.join(getGameRoomChannel(gameRoom.id));
}

function emitJoinedRoomState(socket: Socket, gameRoomId: number, username: string) {
  const gameRoomChannel = getGameRoomChannel(gameRoomId);
  socket.nsp.to(gameRoomChannel).emit('gameRoom:room:joined', username);
}

function broadcastRoomUpdate(socket: Socket, gameRoomId: number, gameRoomState: unknown) {
  const gameRoomChannel = getGameRoomChannel(gameRoomId);
  socket.nsp.to(gameRoomChannel).emit('gameRoom:room:update', gameRoomState);
}

function handleJoinResult(
  socket: Socket,
  memberKey: string,
  username: string,
  gameRoom: ReturnType<typeof gameRoomsManager.joinUserToGameRoom>,
) {
  if (typeof gameRoom === 'string') {
    if (gameRoom === 'error:no_assigned_room') {
      emitGameRoomError(socket, 'not on any room.');
      emitEmptyGameRoomState(socket);
      return;
    }

    if (gameRoom === 'error:alredy_joined_another_room') {
      emitGameRoomError(socket, 'alredy in a room.');
      updateGameRoomState(socket);
      return;
    }

    if (gameRoom === 'error:invalid_room_id') {
      emitGameRoomError(socket, 'inexistent room');
      updateGameRoomState(socket);
      return;
    }

    emitGameRoomError(socket, 'room is full.');
    updateGameRoomState(socket);
    return;
  }

  emitJoinedRoomState(socket, gameRoom.id, username);
  broadcastRoomUpdate(socket, gameRoom.id, gameRoom);
  subscribeMemberToGameRoomChannel(memberKey, gameRoom.id);
  emitGameRoomStateToMember(memberKey, gameRoom);
}

function handleLeaveResult(
  socket: Socket,
  memberKey: string,
  username: string,
  gameRoom: ReturnType<typeof gameRoomsManager.removeUserFromGameRoom>,
) {
  if (gameRoom === 'error:no_assigned_room') {
    emitGameRoomError(socket, 'not on any room.');
    emitEmptyGameRoomState(socket);
    return;
  }

  const { id: gameRoomId } = gameRoom;
  const gameRoomChannel = getGameRoomChannel(gameRoomId);
  unsubscribeMemberFromGameRoomChannel(memberKey, gameRoomId);
  socket.to(gameRoomChannel).emit('gameRoom:room:left', username);
  socket.to(gameRoomChannel).emit('gameRoom:room:update', gameRoom);
  emitGameRoomStateToMember(memberKey, EMPTY_GAME_ROOM_STATE);
  gameRoomNamespace?.to(getGameRoomMemberChannel(memberKey)).emit('gameRoom:debug:msg', 'left room');
}

function logConnection(socket: Socket, roomMemberKey: string, username: string) {
  console.log('=========================================================');
  console.log('[ GameRoom ] new socket connection: ');
  console.log('\t-->\tsocket id:', socket.id);
  console.log('\t-->\tsocket user id:', roomMemberKey);
  console.log('\t-->\tsocket user name:', username);
  console.log('=========================================================');
}

function migrateGuestRoomIfNeeded(
  socket: Socket,
  roomMemberKey: string,
  previousRoomMemberKey: string | null,
  username: string,
) {
  if (!previousRoomMemberKey) {
    return;
  }

  cancelPendingGameRoomRemoval(previousRoomMemberKey);

  const migratedRoom = gameRoomsManager.migrateUserToMemberKey(
    previousRoomMemberKey,
    roomMemberKey,
    username,
  );

  if (typeof migratedRoom !== 'string') {
    broadcastRoomUpdate(socket, migratedRoom.id, migratedRoom);
  }
}

export function registerGameRoomSocket(nsp: Namespace) {
  gameRoomNamespace = nsp;
  nsp.on('connection', (socket: Socket) => {
    const roomMemberKey = incrementGameRoomConnection(socket);
    const previousRoomMemberKey = getPreviousRoomMemberKey(socket);
    const username = socket.data.username;

    if (!roomMemberKey || typeof username !== 'string' || username.length === 0) {
      socket.disconnect(true);
      return;
    }

    migrateGuestRoomIfNeeded(socket, roomMemberKey, previousRoomMemberKey, username);
    void socket.join(getGameRoomMemberChannel(roomMemberKey));
    updateGameRoomState(socket);
    socket.nsp.to(socket.id).emit('gameRoom:debug:msg', 'first connection');
    socket.nsp.to(socket.id).emit('gameRoom:error:msg', 'none');
    logConnection(socket, roomMemberKey, username);

    socket.on('gameRoom:teammate:joinAny', () => {
      const gameRoom = gameRoomsManager.joinUserToAnyGameRoom(roomMemberKey, username);
      handleJoinResult(socket, roomMemberKey, username, gameRoom);
      if (typeof gameRoom !== 'string' && typeof socket.data.userId === 'string' && socket.data.userId.length > 0) {
        markJoinedRoom(socket.data.userId as string, gameRoom.id);
      }
    });

    socket.on('gameRoom:teammate:join', (gameRoomId: number) => {
      const gameRoom = gameRoomsManager.joinUserToGameRoom(roomMemberKey, username, gameRoomId);
      handleJoinResult(socket, roomMemberKey, username, gameRoom);
      if (typeof gameRoom !== 'string' && typeof socket.data.userId === 'string' && socket.data.userId.length > 0) {
        markJoinedRoom(socket.data.userId as string, gameRoom.id);
      }
    });

    socket.on('gameRoom:teammate:leave', () => {
      const gameRoom = gameRoomsManager.removeUserFromGameRoom(roomMemberKey);
      handleLeaveResult(socket, roomMemberKey, username, gameRoom);
      if (typeof socket.data.userId === 'string' && socket.data.userId.length > 0) {
        notifyPendingInvitees(socket.data.userId as string);
      }
    });

    socket.on('gameRoom:teammate:printDebug', () => {
      gameRoomsManager.printInfo();
      updateGameRoomState(socket);
    });

    socket.on('disconnect', () => {
      const connectionState = decrementGameRoomConnection(socket);
      if (!connectionState || connectionState.hasActiveConnections) {
        return;
      }

      scheduleGameRoomRemoval(connectionState.roomMemberKey, (expiredMemberKey) => {
        const gameRoom = gameRoomsManager.removeUserFromGameRoom(expiredMemberKey);
        if (gameRoom === 'error:no_assigned_room') {
          return;
        }

        const gameRoomChannel = getGameRoomChannel(gameRoom.id);
        socket.to(gameRoomChannel).emit('gameRoom:room:left', username);
        socket.to(gameRoomChannel).emit('gameRoom:room:update', gameRoom);
        if (typeof socket.data.userId === 'string' && socket.data.userId.length > 0) {
          notifyPendingInvitees(socket.data.userId as string);
        }
      });
    });
  });
}
