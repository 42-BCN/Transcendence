import type { Socket } from 'socket.io';

import { GameRoomsManager } from './GameRoomsManager';

export const gameRoomsManager = new GameRoomsManager();
const activeGameRoomConnections = new Map<string, number>();

export function getRoomMemberKey(socket: Socket) {
  if (typeof socket.data.userId === 'string' && socket.data.userId.length > 0) {
    return `user:${socket.data.userId}`;
  }

  if (typeof socket.data.guestId === 'string' && socket.data.guestId.length > 0) {
    return `guest:${socket.data.guestId}`;
  }

  if (typeof socket.data.identityKey === 'string' && socket.data.identityKey.length > 0) {
    return socket.data.identityKey;
  }

  return null;
}

export function incrementGameRoomConnection(socket: Socket) {
  const roomMemberKey = getRoomMemberKey(socket);
  if (!roomMemberKey) {
    return null;
  }

  activeGameRoomConnections.set(roomMemberKey, (activeGameRoomConnections.get(roomMemberKey) ?? 0) + 1);
  return roomMemberKey;
}

export function decrementGameRoomConnection(socket: Socket) {
  const roomMemberKey = getRoomMemberKey(socket);
  if (!roomMemberKey) {
    return null;
  }

  const nextCount = (activeGameRoomConnections.get(roomMemberKey) ?? 1) - 1;
  if (nextCount <= 0) {
    activeGameRoomConnections.delete(roomMemberKey);
    return { roomMemberKey, hasActiveConnections: false };
  }

  activeGameRoomConnections.set(roomMemberKey, nextCount);
  return { roomMemberKey, hasActiveConnections: true };
}

export function getUserGameRoom(socket: Socket) {
  const roomMemberKey = getRoomMemberKey(socket);
  if (!roomMemberKey) {
    return null;
  }

  const gameRoom = gameRoomsManager.getUserCurrentGameRoom(roomMemberKey);
  return typeof gameRoom === 'string' ? null : gameRoom;
}

export function getUserGameRoomChannel(socket: Socket) {
  const gameRoom = getUserGameRoom(socket);
  return gameRoom ? `GameRoom-${gameRoom.id}` : null;
}
