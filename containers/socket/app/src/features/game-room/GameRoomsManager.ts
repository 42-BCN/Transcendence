
import type { gameRoomState } from '../../../contracts/sockets/game/game.schema';


export class GameRoomsManager {
  #nextGameRoomId;  //  room are given numbers in acending order of creation. like 0, 1, 2, and so on.
  nextGameRoomId = 0;
  gameRooms = new Map();
  joined_users = new Set();
  
  createGameRoom(): gameRoomState {
  
    const newGameRoomId = this.nextGameRoomId;
    this.nextGameRoomId++;

    let newGameRoom: gameRoomState = {};
	newGameRoom.id = newGameRoomId
    newGameRoom.isGameRoomFull = false;
    newGameRoom.teammates = [];

    this.gameRooms.set(newGameRoomId, newGameRoom);

    return (newGameRoom);
  }

  //	in case of not finding a emty room it will return undefined.
  getFirstNonEmtyGameRoomId(): gameRoomState | undefined {
    for (const [key, value] of this.gameRooms) {
      if (!value.isGameRoomFull) {
        return this.gameRooms.get(key);
      }
    }
    return undefined;
  }

  joinUserToAnyGameRoom(userId: string): gameRoomState {
    let gameRoom: gameRoomState | undefined ;
    gameRoom = this.getFirstNonEmtyGameRoomId();
    if (gameRoom === undefined) {
      gameRoom = this.createGameRoom();
    }
    this.joinUserToGameRoom(userId, gameRoom.id);
    return gameRoom;
  }
  
  //	in case of assignig correcly the user to the room it will return the room, else it returns undefined.
  joinUserToGameRoom(userId: string, gameRoomId: number): gameRoomState | undefined {
	if (this.joined_users.has(userId)) {
		return false ;
	}
	this.joined_users.add(userId);
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


