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

export function registerGameRoomSocket(
  nsp: Namespace
) {
  nsp.on('connection', (socket: Socket<ClientToServerGameRoomsEvents, ServerToClientGameRoomsEvents>) => {

    socket.nsp.to(socket.id).emit("gameRoom:debug:state", {
      id: 0, 
      isGameRoomFull: false, 
      teammates: [],
    });
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
      if (typeof gameRoom == "string") {
        socket.nsp.to(socket.id).emit("gameRoom:error:msg", gameRoom);
        return ;
      }
      socket.join("GameRoom-" + gameRoom.id.toString());
      socket.nsp.to("GameRoom-" + gameRoom.id.toString())
        .emit("gameRoom:room:joined", gameRoom, socket.data.username);
      socket.nsp.to(socket.id).emit("gameRoom:teammate:joinAny:ack", gameRoom);
    });
  


    socket.on("gameRoom:teammate:leave", () => {
      console.log("");
      console.log("[ GameRoom ] request to leave: ");
      console.log("\t-->\tsocket id:", socket.id);
      console.log("\t-->\tsocket user id:", socket.data.identityKey);
      console.log("\t-->\tsocket user name:", socket.data.username);
      console.log("");
      const gameRoom = gameRoomsManager.removeUserFromGameRoom(socket.data.identityKey);
      //  check for returned errors.
      if (typeof gameRoom == "string") {
        socket.nsp.to(socket.id).emit("gameRoom:error:msg", gameRoom);
        return ;
      }
      const gameRoomId = gameRoom.id;
      socket.leave("GameRoom-" + gameRoomId.toString());
      socket.to("GameRoom-" + gameRoomId.toString())
        .emit("gameRoom:teammate:left", socket.data.identityKey);
      socket.nsp.to(socket.id).emit();
      socket.nsp.to(socket.id).emit("gameRoom:debug:state", gameRoom);
    });
    
    

    socket.on("gameRoom:teammate:printDebug", () => {
      console.log("");
      console.log("[ GameRoom ] request to print debug info: ");
      console.log("");
      gameRoomsManager.printInfo();
    
    });

  });
}

