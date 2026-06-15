import type { Namespace, Socket } from 'socket.io';

import {
  cancelPendingGameRoomRemoval,
  decrementGameRoomConnection,
  gameRoomsManager,
  getPreviousRoomMemberKey,
  getRoomMemberKey,
  incrementGameRoomConnection,
  scheduleGameRoomRemoval,
} from './gameRooms.shared';

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

function getGameRoomChannel(gameRoomId: number) {
  return `GameRoom-${gameRoomId}`;
}

function emitEmptyGameRoomState(socket: Socket) {
  socket.nsp.to(socket.id).emit('gameRoom:room:update', EMPTY_GAME_ROOM_STATE);
}

function emitGameRoomError(socket: Socket, message: string) {
  socket.nsp.to(socket.id).emit('gameRoom:error:msg', message);
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

function handleJoinResult(socket: Socket, username: string, gameRoom: ReturnType<typeof gameRoomsManager.joinUserToGameRoom>) {
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
  void socket.join(getGameRoomChannel(gameRoom.id));
  socket.nsp.to(socket.id).emit('gameRoom:room:update', gameRoom);
}

function handleLeaveResult(socket: Socket, username: string, gameRoom: ReturnType<typeof gameRoomsManager.removeUserFromGameRoom>) {
  if (gameRoom === 'error:no_assigned_room') {
    emitGameRoomError(socket, 'not on any room.');
    emitEmptyGameRoomState(socket);
    return;
  }

  const { id: gameRoomId } = gameRoom;
  const gameRoomChannel = getGameRoomChannel(gameRoomId);
  void socket.leave(gameRoomChannel);
  socket.to(gameRoomChannel).emit('gameRoom:room:left', username);
  socket.to(gameRoomChannel).emit('gameRoom:room:update', gameRoom);
  emitEmptyGameRoomState(socket);
  socket.nsp.to(socket.id).emit('gameRoom:debug:msg', 'left room');
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
  nsp.on('connection', (socket: Socket) => {
    const roomMemberKey = incrementGameRoomConnection(socket);
    const previousRoomMemberKey = getPreviousRoomMemberKey(socket);
    const username = socket.data.username;

    if (!roomMemberKey || typeof username !== 'string' || username.length === 0) {
      socket.disconnect(true);
      return;
    }

    migrateGuestRoomIfNeeded(socket, roomMemberKey, previousRoomMemberKey, username);
    updateGameRoomState(socket);
    socket.nsp.to(socket.id).emit('gameRoom:debug:msg', 'first connection');
    socket.nsp.to(socket.id).emit('gameRoom:error:msg', 'none');
    logConnection(socket, roomMemberKey, username);

    socket.on('gameRoom:teammate:joinAny', () => {
      const gameRoom = gameRoomsManager.joinUserToAnyGameRoom(roomMemberKey, username);
      handleJoinResult(socket, username, gameRoom);
    });

    socket.on('gameRoom:teammate:join', (gameRoomId: number) => {
      const gameRoom = gameRoomsManager.joinUserToGameRoom(roomMemberKey, username, gameRoomId);
      handleJoinResult(socket, username, gameRoom);
    });

    socket.on('gameRoom:teammate:leave', () => {
      const gameRoom = gameRoomsManager.removeUserFromGameRoom(roomMemberKey);
      handleLeaveResult(socket, username, gameRoom);
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
      });
    });
  });
}
