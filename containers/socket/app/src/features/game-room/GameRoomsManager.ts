
import type { gameRoomState } from '../../../contracts/sockets/game/game.schema';

export class GameRoomsManager {
  #nextGameRoomId;  //  room are given numbers in acending order of creation. like 0, 1, 2, and so on.
  gameRooms; // a map of room id and room state;
  consturctor() {
    nextRoomNumberId = 0;
    gameRooms = new Map();
  }
  
  createGameRoom(): number {
  
    const newGameRoomId = nextGameRoomId;
    nextGameRoomId++;

    let newGameRoom: gameRoomState;
    newGameRoom.isGameRoomFull = false;

    gameRooms.set(nextGameRoomId, newGameRoom);

    return (newGameRoomId);
  }

  getFirstNonEmtyGameRoomId(): number {
    for (const [key, value] of gameRooms) {
      if (!value.isGameRoomFull) {
        return key;
      }
    }
    return -1;
  }

  joinUserToAnyGameRoom(userId: string): number {
    let gameRoomId: number;
    gameRoomId = this.getFirstNonEmtyGameRoomId();
    if (gameRoomId == -1) {
      gameRoomId = this.createGameRoom();
    }
    this.joinUserToGameRoom(gameRoomId, userId);
    return gameRoomId;
  }
  
  joinUserToGameRoom(userId: string, gameRoomId: number) {
    if (gameRooms[gameRoomId].isGameRoomFull) {
      return false ;
    }
    // TODO: check if user is alredy in room.
    gameRooms[gameRoomId].teammates.push({userId, undefined});
    if (gameRooms[gameRoomId].teammates.length == 4) {
      gameRooms[gameRoomId].isGameRoomFull = true;
    }
    return true;
  }

  removeUserFromGameRoom(userId: number, gameRoomId: number) {
    let newTeammates: {userId: string, role?: string}[];
    for ( const teammate of gameRooms[gameRoomId].teammates) {
      if (userId != teammates.userId) {
        newTeammates.push(teammate);
      }
    }
    gameRooms[gameRoomId].teammates = [...newTeammates];
    if (gameRooms[gameRoomId].isGameRoomFull == true) {
      gameRooms[gameRoomId].isGameRoomFull = false;
    }
  }
};


