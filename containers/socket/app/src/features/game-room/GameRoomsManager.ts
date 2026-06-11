
import type { gameRoomState } from '../../../contracts/sockets/game/game.schema';

//	the possbile error that this could return are:\
//		- error:alredy_joined_another_room
//		- error:invalid_room_id
//		- error:full_room
//		- error:no_assigned_room
//		- error:

export class GameRoomsManager {
  #nextGameRoomId;  //  room are given numbers in acending order of creation. like 0, 1, 2, and so on.
  nextGameRoomId = 1;
  gameRooms = new Map();
  joined_users = new Set();
  

  printInfo() {
    console.log("[ gameRoom ][ debug ] rooms: ", this.gameRooms);
    for (const [key, value] of this.gameRooms) {
      console.log("[ gameRoom ][ debug ] room", key, ":", value);
    }
    console.log("")
    console.log("[ gameRoom ][ debug ] joined users: ", this.joined_users);
  }



  getUserCurrentGameRoom(userId: string): gameRoomState 
    | "error:no_assigned_room" 
    | "error:" 
  {
    console.log("[ gameRoom ][ IMPORTANT ] trying to get the user room:");
    if (! this.joined_users.has(userId)) {
      console.log("[ gameRoom ][ error ] no_assigned_room: ");
      console.log("\t-->\tuser id:", userId);
      console.log("\t-->\tjoined users: ", this.joined_users);
      console.log("\t-->\trooms: ", this.gameRooms);
      return "error:no_assigned_room";
    }
    let gameRoomId: number | undefined = undefined;
    for (const [currentGameRoomId, gameRoom] of this.gameRooms) {
      if (gameRoom.teammates !== undefined ) {
        for (const teammate of gameRoom.teammates) {
          console.log("[ gameRoom ][ IMPORTANT ] the teammate is:", teammate);
          console.log("[ gameRoom ][ IMPORTANT ] the userid is:", userId);
          if (teammate.userId == userId) {
            gameRoomId = gameRoom.id;
            break ;
          }
        }
      }
      if (gameRoomId !== undefined ) {
        break ;
      }
    }
    if (gameRoomId === undefined) {
      console.log("[ gameRoom ][ error ] something went wrong not quite shure what: ");
      console.log("\t-->\tuser id:", userId);
      console.log("\t-->\tuser name:", userName);
      console.log("\t-->\tjoined users: ", this.joined_users);
      console.log("\t-->\trooms: ", this.gameRooms);
      return "error:";
    }
    return this.gameRooms.get(gameRoomId);
  }



  createGameRoom(): gameRoomState {
  
    const newGameRoomId = this.nextGameRoomId;
    this.nextGameRoomId++;

    let newGameRoom: gameRoomState = {};
    newGameRoom.id = newGameRoomId;
    newGameRoom.isGameRoomFull = false;
    newGameRoom.teammates = [];

    this.gameRooms.set(newGameRoomId, newGameRoom);

    return (newGameRoom);
  }



  //	in case of not finding a emty room it will return undefined.
  getFirstNonEmtyGameRoomId(): gameRoomState | undefined 
  {
    for (const [key, value] of this.gameRooms) {
      if (!value.isGameRoomFull) {
        return this.gameRooms.get(key);
      }
    }
    return undefined;
  }



  joinUserToAnyGameRoom(userId: string, userName: string): gameRoomState 
    | "error:alredy_joined_another_room" 
    | "error:invalid_room_id" 
    | "error:full_room" 
  {
    if (this.joined_users.has(userId)) {
      console.log("[ gameRoom ][ error ] alredy_joined_another_room: ");
      console.log("\t-->\tuser id:", userId);
      console.log("\t-->\tuser name:", userName);
      console.log("\t-->\tjoined users: ", this.joined_users);
      console.log("\t-->\trooms: ", this.gameRooms);
      return "error:alredy_joined_another_room";
	  }
    
    let gameRoom: gameRoomState | undefined ;
    gameRoom = this.getFirstNonEmtyGameRoomId();
    if (gameRoom === undefined) {
      gameRoom = this.createGameRoom();
    }
    gameRoom = this.joinUserToGameRoom(userId, userName, gameRoom.id);
    return gameRoom;
  }
  


  //	in case of assignig correcly the user to the room it will return the room, else it returns undefined.
  joinUserToGameRoom(userId: string, userName: string, gameRoomId: number): gameRoomState 
    | "error:alredy_joined_another_room" 
    | "error:invalid_room_id"
    | "error:full_room"
  {
    if (this.joined_users.has(userId)) {
      console.log("[ gameRoom ][ error ] alredy_joined_another_room: ");
      console.log("\t-->\tuser id:", userId);
      console.log("\t-->\tuser name:", userName);
      console.log("\t-->\troom id:", gameRoomId);
      console.log("\t-->\tjoined users: ", this.joined_users);
      console.log("\t-->\trooms: ", this.gameRooms);
      return "error:alredy_joined_another_room" ;
    }
	  if (this.gameRooms.get(gameRoomId) === undefined) {
      console.log("[ gameRoom ][ error ] invalid_room_id: ");
      console.log("\t-->\tuser id:", userId);
      console.log("\t-->\tuser name:", userName);
      console.log("\t-->\troom id:", gameRoomId);
      console.log("\t-->\tjoined users: ", this.joined_users);
      console.log("\t-->\trooms: ", this.gameRooms);
      return "error:invalid_room_id" ;
  	}
    if (this.gameRooms.get(gameRoomId).isGameRoomFull === true) {
      console.log("[ gameRoom ][ error ] full_room: ");
      console.log("\t-->\tuser id:", userId);
      console.log("\t-->\tuser name:", userName);
      console.log("\t-->\troom id:", gameRoomId);
      console.log("\t-->\tjoined users: ", this.joined_users);
      console.log("\t-->\trooms: ", this.gameRooms);
      return "error:full_room" ;
    }

  	this.joined_users.add(userId);
    this.gameRooms.get(gameRoomId).teammates.push({userId, userName});
    if (this.gameRooms.get(gameRoomId).teammates.length == 4) {
      this.gameRooms.get(gameRoomId).isGameRoomFull = true;
    }
    return this.gameRooms.get(gameRoomId);
  }



  removeUserFromGameRoom(userId: string): gameRoomState
    | "error:no_assigned_room" 
    | "error:" 
  {

    if (! this.joined_users.has(userId)) {
      console.log("[ gameRoom ][ error ] no_assigned_room: ");
      console.log("\t-->\tuser id:", userId);
      console.log("\t-->\tjoined users: ", this.joined_users);
      console.log("\t-->\trooms: ", this.gameRooms);
      return "error:no_assigned_room" ;
    }

    const gameRoom = this.getUserCurrentGameRoom(userId);
    if (typeof gameRoom === "string") {
      return gameRoom;
    }
    const gameRoomId = gameRoom.id;

    this.gameRooms.get(gameRoomId).teammates = [...this.gameRooms.get(gameRoomId).teammates.filter((item) => item.userId != userId)];
    this.gameRooms.get(gameRoomId).isGameRoomFull = false;
    this.joined_users.delete(userId);
    return this.gameRooms.get(gameRoomId);
  }

};


