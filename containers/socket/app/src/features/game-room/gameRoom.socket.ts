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
    console.log("[ GameRoom ] client connection: " + socket.data.identityKey);

    socket.nsp.to(socket.id).emit("gameRoom:debug:state", "none");
    socket.nsp.to(socket.id).emit("gameRoom:debug:msg", "first connection");
    socket.nsp.to(socket.id).emit("gameRoom:error:msg", "none");
    
    socket.on("gameRoom:teammate:joinAny", () => {
      console.log("[ GameRoom ] join request, from: ", socket.data.identityKey.toString());
      console.log("[ GameRoom ] data : ", socket.data);
      let gameRoom = gameRoomsManager.joinUserToAnyGameRoom(socket.data.identityKey, socket.data.username);
      console.log("[ GameRoom ] !! ", gameRoom);
      if (gameRoom === undefined) {
        return ;
      }
      socket.join("GameRoom-" + gameRoom.id.toString());
      socket.to("GameRoom-" + gameRoom.id.toString())
        .emit("gameRoom:room:joined", gameRoom, socket.data.username);
      socket.nsp.to(socket.id).emit("gameRoom:teammate:joinAny:ack", gameRoom);
    });
    
    socket.on("gameRoom:teammate:leave", () => {
      socket.leave("GameRoom-" + currentGameRoomId.toString());
      socket.to("GameRoom-" + currentGameRoomId.toString())
        .emit("gameRoom:teammate:left", socket.data.identityKey);
    });
  });
}

