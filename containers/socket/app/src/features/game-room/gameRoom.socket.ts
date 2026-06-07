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
      const gameRoom = gameRoomsManager.joinUserToAnyGameRoom(socket.data.identityKey, socket.data.username);
      if (gameRoom === undefined) {
        return ;
      }
      socket.join("GameRoom-" + gameRoom.id.toString());
      socket.nsp.to("GameRoom-" + gameRoom.id.toString())
        .emit("gameRoom:room:joined", gameRoom, socket.data.username);
      socket.nsp.to(socket.id).emit("gameRoom:teammate:joinAny:ack", gameRoom);
    });
    
    socket.on("gameRoom:teammate:leave", (gameRoomId: number) => {
      console.log("[ TAHA TAHERE ] READ THIS: ", gameRoomId);
      if (gameRoomId === null) {
        return ;
      }
      socket.leave("GameRoom-" + gameRoomId.toString());
      const gameRoom = gameRoomsManager.removeUserFromGameRoom(socket.data.identityKey, gameRoomId);
      socket.to("GameRoom-" + gameRoomId.toString())
        .emit("gameRoom:teammate:left", socket.data.identityKey);
      console.log("[ gameRoom ] user removed.", gameRoom);
    });
  });
}

