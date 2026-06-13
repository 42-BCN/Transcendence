import type { Namespace, Socket } from 'socket.io';
import { GameRoomsManager } from './GameRoomsManager.ts';
import type {
  ClientToServerGameRoomsEvents,
  ServerToClientGameRoomsEvents,
} from '@contracts/sockets/chat/gameRooms.schema';

const gameRoomsManager = new GameRoomsManager();

//interface Client

//  really important:
//    socket.data.identityKey is the same as a user id for me.
//    socket.data.username is the same as a nickname or username for me.


//  some helper functions.

function  setEmtyGameRoomState(socket: Socket) {
  socket.nsp.to(socket.id).emit("gameRoom:room:update", {
    id: 0, 
    isGameRoomFull: false, 
    teammates: [],
  });
}

function  updateGameRoomState() {
  
}

//  all the server acctions.

export function registerGameRoomSocket(
  nsp: Namespace
) {
  nsp.on('connection', (socket: Socket) => {

    const currentGameRoom = gameRoomsManager.getUserCurrentGameRoom(socket.data.identityKey);
    if (currentGameRoom === "error:no_assigned_room") {
      setEmtyGameRoomState(socket);
    } else if (typeof currentGameRoom === "string") {
      socket.nsp.to(socket.id)
        .emit("gameRoom:error:msg", "something has gone wrong try again later.");
    } else {
      socket.nsp.to(socket.id).emit("gameRoom:room:update", currentGameRoom);
      socket.join("GameRoom-" + currentGameRoom.id.toString());
    }
    socket.nsp.to(socket.id).emit("gameRoom:debug:msg", "first connection");
    socket.nsp.to(socket.id).emit("gameRoom:error:msg", "none");
    
    console.log("=========================================================");
    console.log("[ GameRoom ] new socket connection: ");
    console.log("\t-->\tsocket id:", socket.id);
    console.log("\t-->\tsocket user id:", socket.data.identityKey);
    console.log("\t-->\tsocket user name:", socket.data.username);
    console.log("=========================================================");

    

    socket.on("gameRoom:teammate:joinAny", () => {
      console.log("");
      console.log("[ GameRoom ] request to join any room: ");
      console.log("\t-->\tsocket id:", socket.id);
      console.log("\t-->\tsocket user id:", socket.data.identityKey);
      console.log("\t-->\tsocket user name:", socket.data.username);
      console.log("");
      const gameRoom = gameRoomsManager.joinUserToAnyGameRoom(socket.data.identityKey, socket.data.username);
      //  check for returned errors.
      if (gameRoom === "error:alredy_joined_another_room") {
        socket.nsp.to(socket.id).emit("gameRoom:error:msg", "alredy in a room.");
        //  update the game room state.
        const gameRoom = gameRoomsManager.getUserCurrentGameRoom(socket.data.identityKey);
        if (gameRoom === "error:no_assigned_room") {
          setEmtyGameRoomState(socket.id);
          return ;
        }
        if (typeof gameRoom === "string") {
          socket.nsp.to(socket.id)
            .emit("gameRoom:error:msg", "something has gone wrong try again later.");
          return ;
        }
        socket.nsp.to(socket.id).emit("gameRoom:room:update", gameRoom);
        socket.join("GameRoom-" + gameRoom.id.toString());
        return ;
      }
      if (typeof gameRoom == "string") {
        socket.nsp.to(socket.id)
          .emit("gameRoom:error:msg", "something has gone wrong try again later.");
        return ;
      }
      socket.nsp.to("GameRoom-" + gameRoom.id.toString())
        .emit("gameRoom:room:joined", socket.data.username);
      socket.nsp.to("GameRoom-" + gameRoom.id.toString())
        .emit("gameRoom:room:update", gameRoom);
      socket.join("GameRoom-" + gameRoom.id.toString());
      socket.nsp.to(socket.id).emit("gameRoom:room:update", gameRoom);
    });
 


//    socket.on("gameRoom:teammate:join", (gameRoomId: number) => {
//      console.log("");
//      console.log("[ GameRoom ] request to joim ", gameRoomId, " :");
//      console.log("\t-->\tsocket id:", socket.id);
//      console.log("\t-->\tsocket user id:", socket.data.identityKey);
//      console.log("\t-->\tsocket user name:", socket.data.username);
//      console.log("");
//
//      const gameRoom = gameRoomsManager.joinUserToGameRoom(
//        socket.data.identityKey, 
//        socket.data.username,
//        gameRoomId
//      );
//      if (gameRoom === "error:alredy_joined_another_room") {
//        socket.nsp.to(socket.id).emit("gameRoom:error:msg", "alredy in a room.");
//        //  update the game room state.
//        const gameRoom = gameRoomsManager.getUserCurrentGameRoom(socket.data.identityKey);
//        if (gameRoom === "error:no_assigned_room") {
//          setEmtyGameRoomState(socket);
//          return ;
//        }
//        if (typeof gameRoom === "string") {
//          socket.nsp.to(socket.id)
//            .emit("gameRoom:error:msg", "something has gone wrong try again later.");
//          return ;
//        }
//      }
//      if (typeof gameRoom === "string") {
//        socket.nsp.to(socket.id)
//          .emit("gameRoom:error:msg", "something has gone wrong try again later.");
//        return ;
//      }
//
//
//    });



    socket.on("gameRoom:teammate:leave", () => {
      console.log("");
      console.log("[ GameRoom ] request to leave: ");
      console.log("\t-->\tsocket id:", socket.id);
      console.log("\t-->\tsocket user id:", socket.data.identityKey);
      console.log("\t-->\tsocket user name:", socket.data.username);
      console.log("");
      const gameRoom = gameRoomsManager.removeUserFromGameRoom(socket.data.identityKey);
      //  check for returned errors.
      if (gameRoom === "error:no_assigned_room") {
        socket.nsp.to(socket.id).emit("gameRoom:error:msg", "not on any room.");
        setEmtyGameRoomState(socket);
      }
      if (typeof gameRoom == "string") {
        socket.nsp.to(socket.id)
          .emit("gameRoom:error:msg", "something has gone wrong try again later.");
        return ;
      }
      const gameRoomId = gameRoom.id;
      socket.leave("GameRoom-" + gameRoomId.toString());
      socket.to("GameRoom-" + gameRoomId.toString())
        .emit("gameRoom:room:left", socket.data.username);
      socket.to("GameRoom-" + gameRoomId.toString())
        .emit("gameRoom:room:update", gameRoom);

      setEmtyGameRoomState(socket);
      socket.nsp.to(socket.id).emit("gameRoom:debug:msg", "left room");
    });
    
    

    socket.on("gameRoom:teammate:printDebug", () => {
      console.log("");
      console.log("[ GameRoom ] request to print debug info: ");
      console.log("");
      gameRoomsManager.printInfo();

      const gameRoom = gameRoomsManager.getUserCurrentGameRoom(socket.data.identityKey);
      if (gameRoom === "error:no_assigned_room") {
        setEmtyGameRoomState(socket);
        return ;
      }
      if (typeof gameRoom === "string") {
        socket.nsp.to(socket.id)
          .emit("gameRoom:error:msg", "something has gone wrong try again later.");
        return ;
      }
      socket.nsp.to(socket.id).emit("gameRoom:room:update", gameRoom);
    });
  });
}


//  really important:
//    socket.data.identityKey is the same as a user id for me.
//    socket.data.username is the same as a nickname or username for me.

