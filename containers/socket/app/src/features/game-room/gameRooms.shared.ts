import type { Socket } from 'socket.io';

import { GameRoomsManager } from './GameRoomsManager';

export const gameRoomsManager = new GameRoomsManager();
const activeGameRoomConnections = new Map<string, number>();
const pendingRoomRemovalTimeouts = new Map<string, ReturnType<typeof setTimeout>>();
const ROOM_MEMBER_RECONNECT_GRACE_MS = 30000;

function toMemberKey(prefix: 'user' | 'guest', value: unknown) {
  return typeof value === 'string' && value.length > 0 ? `${prefix}:${value}` : null;
}

export function getRoomMemberKey(socket: Socket) {
  return (
    toMemberKey('user', socket.data.userId)
    ?? toMemberKey('guest', socket.data.guestId)
    ?? (typeof socket.data.identityKey === 'string' && socket.data.identityKey.length > 0
      ? socket.data.identityKey
      : null)
  );
}

export function getPreviousRoomMemberKey(socket: Socket) {
  if (
    typeof socket.data.previousGuestId === 'string'
    && socket.data.previousGuestId.length > 0
    && typeof socket.data.userId === 'string'
    && socket.data.userId.length > 0
  ) {
    return `guest:${socket.data.previousGuestId}`;
  }

  return null;
}

export function incrementGameRoomConnection(socket: Socket) {
  const roomMemberKey = getRoomMemberKey(socket);
  if (!roomMemberKey) {
    return null;
  }

  const pendingRemoval = pendingRoomRemovalTimeouts.get(roomMemberKey);
  if (pendingRemoval) {
    clearTimeout(pendingRemoval);
    pendingRoomRemovalTimeouts.delete(roomMemberKey);
  }

  activeGameRoomConnections.set(roomMemberKey, (activeGameRoomConnections.get(roomMemberKey) ?? 0) + 1);
  return roomMemberKey;
}

export function hasActiveGameRoomConnection(memberKey: string) {
  return (activeGameRoomConnections.get(memberKey) ?? 0) > 0;
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

export function cancelPendingGameRoomRemoval(memberKey: string | null) {
  if (!memberKey) {
    return;
  }

  const pendingRemoval = pendingRoomRemovalTimeouts.get(memberKey);
  if (!pendingRemoval) {
    return;
  }

  clearTimeout(pendingRemoval);
  pendingRoomRemovalTimeouts.delete(memberKey);
}

export function scheduleGameRoomRemoval(
  memberKey: string,
  onExpire: (expiredMemberKey: string) => void,
) {
  cancelPendingGameRoomRemoval(memberKey);

  const timeoutId = setTimeout(() => {
    pendingRoomRemovalTimeouts.delete(memberKey);
    onExpire(memberKey);
  }, ROOM_MEMBER_RECONNECT_GRACE_MS);

  pendingRoomRemovalTimeouts.set(memberKey, timeoutId);
}
