
import type { gameRoomState } from '../../../contracts/sockets/game/game.schema';

export class GameRoomsManager {
  #nextGameRoomId;  //  room are given numbers in acending order of creation. like 0, 1, 2, and so on.
  nextGameRoomId = 0;
  gameRooms = new Map();
  
  createGameRoom(): number {
  
    const newGameRoomId = this.nextGameRoomId;
    this.nextGameRoomId++;

    let newGameRoom: gameRoomState = {};
    console.log(newGameRoom);
    newGameRoom.isGameRoomFull = false;
    newGameRoom.teammates = [];

    this.gameRooms.set(newGameRoomId, newGameRoom);

    console.log("patata: " + newGameRoomId);
    return (newGameRoomId);
  }

  getFirstNonEmtyGameRoomId(): number {
    for (const [key, value] of this.gameRooms) {
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
      console.log("hint!!");
      gameRoomId = this.createGameRoom();
    }
    this.joinUserToGameRoom(userId, gameRoomId);
    return gameRoomId;
  }
  
  joinUserToGameRoom(userId: string, gameRoomId: number) {
    console.log("the game room is:  " + gameRoomId);
    console.log(this.gameRooms);
    console.log(this.gameRooms.get(gameRoomId));
    if (this.gameRooms.get(gameRoomId).isGameRoomFull == true) {
      return false ;
    }
    // TODO: check if user is alredy in room.
    this.gameRooms.get(gameRoomId).teammates.push({userId, undefined});
    if (this.gameRooms.get(gameRoomId).teammates.length == 4) {
      this.gameRooms.get(gameRoomId).isGameRoomFull = true;
    }
    return true;
  }

  removeUserFromGameRoom(userId: number, gameRoomId: number) {
    let newTeammates: {userId: string, role?: string}[];
    for ( const teammate of this.gameRooms.get(gameRoomId).teammates) {
      if (userId != teammates.userId) {
        newTeammates.push(teammate);
      }
    }
    this.gameRooms.get(gameRoomId).teammates = [...newTeammates];
    if (this.gameRooms.get(gameRoomId).isGameRoomFull == true) {
      this.gameRooms.get(gameRoomId).isGameRoomFull = false;
    }
  }
};


