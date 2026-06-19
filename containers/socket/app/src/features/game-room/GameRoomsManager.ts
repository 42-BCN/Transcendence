import type { gameRoomState } from '@contracts/sockets/rooms/gameRooms.schema';

type GameRoomError =
  | 'error:alredy_joined_another_room'
  | 'error:invalid_room_id'
  | 'error:full_room'
  | 'error:no_assigned_room';

type Teammate = gameRoomState['teammates'][number];
export type GameRoomRemovalResult = {
  room: gameRoomState;
  closed: boolean;
  affectedMemberKeys: string[];
};

const MAX_TEAMMATES_PER_ROOM = 4;

export class GameRoomsManager {
  nextGameRoomId = 1;
  gameRooms = new Map<number, gameRoomState>();
  memberRoomIds = new Map<string, number>();
  onRoomDeleted?: (roomId: number) => void;

  setOnRoomDeleted(callback: ((roomId: number) => void) | undefined) {
    this.onRoomDeleted = callback;
  }

  printInfo() {
    console.log('[ gameRoom ][ debug ] rooms: ', this.gameRooms);
    for (const [key, value] of this.gameRooms) {
      console.log('[ gameRoom ][ debug ] room', key, ':', value);
    }
    console.log('');
    console.log('[ gameRoom ][ debug ] memberRoomIds: ', this.memberRoomIds);
  }

  getUserCurrentGameRoom(memberKey: string): gameRoomState | 'error:no_assigned_room' {
    const gameRoomId = this.memberRoomIds.get(memberKey);
    if (gameRoomId === undefined) {
      console.log('[ gameRoom ][ error ] no_assigned_room: ');
      console.log('\t-->\tmember key:', memberKey);
      console.log('\t-->\tmemberRoomIds: ', this.memberRoomIds);
      console.log('\t-->\trooms: ', this.gameRooms);
      return 'error:no_assigned_room';
    }

    const gameRoom = this.gameRooms.get(gameRoomId);
    if (!gameRoom) {
      this.memberRoomIds.delete(memberKey);
      console.log('[ gameRoom ][ error ] no_assigned_room: room mapping missing');
      console.log('\t-->\tmember key:', memberKey);
      console.log('\t-->\troom id:', gameRoomId);
      return 'error:no_assigned_room';
    }

    return gameRoom;
  }

  createGameRoom(): gameRoomState {
    const newGameRoomId = this.nextGameRoomId;
    this.nextGameRoomId++;

    const newGameRoom: gameRoomState = {
      id: newGameRoomId,
      isGameRoomFull: false,
      status: 'open',
      teammates: [],
    };

    this.gameRooms.set(newGameRoomId, newGameRoom);
    return newGameRoom;
  }

  getGameRoomById(gameRoomId: number): gameRoomState | null {
    return this.gameRooms.get(gameRoomId) ?? null;
  }

  getFirstNonEmtyGameRoomId(): gameRoomState | undefined {
    for (const gameRoom of this.gameRooms.values()) {
      if (this.isRoomJoinable(gameRoom)) {
        return gameRoom;
      }
    }

    return undefined;
  }

  joinUserToAnyGameRoom(memberKey: string, userName: string): gameRoomState | GameRoomError {
    if (this.memberRoomIds.has(memberKey)) {
      console.log('[ gameRoom ][ error ] alredy_joined_another_room: ');
      console.log('\t-->\tmember key:', memberKey);
      console.log('\t-->\tuser name:', userName);
      console.log('\t-->\tmemberRoomIds: ', this.memberRoomIds);
      console.log('\t-->\trooms: ', this.gameRooms);
      return 'error:alredy_joined_another_room';
    }

    const gameRoom = this.getFirstNonEmtyGameRoomId() ?? this.createGameRoom();
    return this.joinUserToGameRoom(memberKey, userName, gameRoom.id);
  }

  joinUserToGameRoom(memberKey: string, userName: string, gameRoomId: number): gameRoomState | GameRoomError {
    if (this.memberRoomIds.has(memberKey)) {
      console.log('[ gameRoom ][ error ] alredy_joined_another_room: ');
      console.log('\t-->\tmember key:', memberKey);
      console.log('\t-->\tuser name:', userName);
      console.log('\t-->\troom id:', gameRoomId);
      console.log('\t-->\tmemberRoomIds: ', this.memberRoomIds);
      console.log('\t-->\trooms: ', this.gameRooms);
      return 'error:alredy_joined_another_room';
    }

    const gameRoom = this.gameRooms.get(gameRoomId);
    if (!gameRoom) {
      console.log('[ gameRoom ][ error ] invalid_room_id: ');
      console.log('\t-->\tmember key:', memberKey);
      console.log('\t-->\tuser name:', userName);
      console.log('\t-->\troom id:', gameRoomId);
      return 'error:invalid_room_id';
    }

    if (!this.isRoomJoinable(gameRoom)) {
      console.log('[ gameRoom ][ error ] full_room: ');
      console.log('\t-->\tmember key:', memberKey);
      console.log('\t-->\tuser name:', userName);
      console.log('\t-->\troom id:', gameRoomId);
      return 'error:full_room';
    }

    const teammate: Teammate = { userId: memberKey, userName };
    gameRoom.teammates.push(teammate);
    this.syncRoomFlags(gameRoom);
    this.memberRoomIds.set(memberKey, gameRoomId);

    return gameRoom;
  }

  ensureUserGameRoom(memberKey: string, userName: string): gameRoomState | 'error:full_room' {
    const existingRoom = this.getExistingRoomForMember(memberKey);
    if (existingRoom) {
      const teammate = existingRoom.teammates.find((item) => item.userId === memberKey);
      if (teammate) {
        teammate.userName = userName;
      }

      if (!this.isRoomJoinable(existingRoom)) {
        return 'error:full_room';
      }

      return existingRoom;
    }

    const room = this.createGameRoom();
    const result = this.joinUserToGameRoom(memberKey, userName, room.id);
    if (typeof result === 'string') {
      return 'error:full_room';
    }

    return result;
  }

  removeUserFromGameRoom(memberKey: string): GameRoomRemovalResult | 'error:no_assigned_room' {
    const gameRoomId = this.memberRoomIds.get(memberKey);
    if (gameRoomId === undefined) {
      console.log('[ gameRoom ][ error ] no_assigned_room: ');
      console.log('\t-->\tmember key:', memberKey);
      console.log('\t-->\tmemberRoomIds: ', this.memberRoomIds);
      return 'error:no_assigned_room';
    }

    const gameRoom = this.gameRooms.get(gameRoomId);
    this.memberRoomIds.delete(memberKey);

    if (!gameRoom) {
      return 'error:no_assigned_room';
    }

    gameRoom.teammates = gameRoom.teammates.filter((item) => item.userId !== memberKey);
    const shouldCloseRoom = gameRoom.status === 'locked' || gameRoom.teammates.length === 0;

    if (shouldCloseRoom) {
      const affectedMemberKeys = [memberKey, ...gameRoom.teammates.map((item) => item.userId)];
      for (const affectedMemberKey of affectedMemberKeys) {
        this.memberRoomIds.delete(affectedMemberKey);
      }

      this.gameRooms.delete(gameRoomId);
      this.onRoomDeleted?.(gameRoomId);

      return {
        room: {
          ...gameRoom,
          teammates: [],
          isGameRoomFull: false,
          status: gameRoom.status,
        },
        closed: true,
        affectedMemberKeys,
      };
    }

    this.syncRoomFlags(gameRoom);

    return {
      room: gameRoom,
      closed: false,
      affectedMemberKeys: [memberKey],
    };
  }

  private getExistingRoomForMember(memberKey: string) {
    const roomId = this.memberRoomIds.get(memberKey);
    if (roomId === undefined) {
      return null;
    }

    const room = this.gameRooms.get(roomId);
    if (!room) {
      this.memberRoomIds.delete(memberKey);
      return null;
    }

    return room;
  }

  private isRoomJoinable(room: gameRoomState) {
    return room.status === 'open' && room.teammates.length < MAX_TEAMMATES_PER_ROOM;
  }

  private syncRoomFlags(room: gameRoomState) {
    room.isGameRoomFull = room.teammates.length >= MAX_TEAMMATES_PER_ROOM;
    room.status = room.isGameRoomFull ? 'locked' : 'open';
  }
}
