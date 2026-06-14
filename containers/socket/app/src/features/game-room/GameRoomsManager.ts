import type { gameRoomState } from '@contracts/sockets/rooms/gameRooms.schema';

type GameRoomError =
  | 'error:alredy_joined_another_room'
  | 'error:invalid_room_id'
  | 'error:full_room'
  | 'error:no_assigned_room';

type Teammate = gameRoomState['teammates'][number];

const MAX_TEAMMATES_PER_ROOM = 4;

export class GameRoomsManager {
  nextGameRoomId = 1;
  gameRooms = new Map<number, gameRoomState>();
  memberRoomIds = new Map<string, number>();

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
      teammates: [],
    };

    this.gameRooms.set(newGameRoomId, newGameRoom);
    return newGameRoom;
  }

  getFirstNonEmtyGameRoomId(): gameRoomState | undefined {
    for (const gameRoom of this.gameRooms.values()) {
      if (!gameRoom.isGameRoomFull) {
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

    if (gameRoom.teammates.length >= MAX_TEAMMATES_PER_ROOM) {
      console.log('[ gameRoom ][ error ] full_room: ');
      console.log('\t-->\tmember key:', memberKey);
      console.log('\t-->\tuser name:', userName);
      console.log('\t-->\troom id:', gameRoomId);
      return 'error:full_room';
    }

    const teammate: Teammate = { userId: memberKey, userName };
    gameRoom.teammates.push(teammate);
    gameRoom.isGameRoomFull = gameRoom.teammates.length >= MAX_TEAMMATES_PER_ROOM;
    this.memberRoomIds.set(memberKey, gameRoomId);

    return gameRoom;
  }

  removeUserFromGameRoom(memberKey: string): gameRoomState | 'error:no_assigned_room' {
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
    gameRoom.isGameRoomFull = false;

    if (gameRoom.teammates.length === 0) {
      this.gameRooms.delete(gameRoomId);
    }

    return gameRoom;
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

  private updateTeammateIdentity(
    gameRoom: gameRoomState,
    previousMemberKey: string,
    nextMemberKey: string,
    nextUserName: string,
  ) {
    const teammate = gameRoom.teammates.find((item) => item.userId === previousMemberKey);
    if (!teammate) {
      return false;
    }

    teammate.userId = nextMemberKey;
    teammate.userName = nextUserName;
    return true;
  }

  private syncExistingMemberRoom(nextMemberKey: string, nextUserName: string) {
    const existingRoom = this.getExistingRoomForMember(nextMemberKey);
    if (!existingRoom) {
      return null;
    }

    const teammate = existingRoom.teammates.find((item) => item.userId === nextMemberKey);
    if (teammate) teammate.userName = nextUserName;
    return existingRoom;
  }

  migrateUserToMemberKey(
    previousMemberKey: string,
    nextMemberKey: string,
    nextUserName: string,
  ): gameRoomState | 'error:no_assigned_room' | 'error:alredy_joined_another_room' {
    if (previousMemberKey === nextMemberKey) {
      return this.getUserCurrentGameRoom(nextMemberKey);
    }

    const existingRoom = this.syncExistingMemberRoom(nextMemberKey, nextUserName);
    if (existingRoom) {
      return existingRoom;
    }

    const previousRoom = this.getExistingRoomForMember(previousMemberKey);
    if (!previousRoom) {
      return 'error:no_assigned_room';
    }

    const didUpdateTeammate = this.updateTeammateIdentity(
      previousRoom,
      previousMemberKey,
      nextMemberKey,
      nextUserName,
    );

    if (!didUpdateTeammate) {
      this.memberRoomIds.delete(previousMemberKey);
      return 'error:no_assigned_room';
    }

    this.memberRoomIds.delete(previousMemberKey);
    this.memberRoomIds.set(nextMemberKey, previousRoom.id);
    return previousRoom;
  }
}
