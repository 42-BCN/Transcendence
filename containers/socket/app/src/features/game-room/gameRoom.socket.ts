import type { Namespace, Socket } from 'socket.io';
import { GameRoomsManager } from './GameRoomsManager.ts';
import type {
  ClientToServerGameRoomsEvents,
  ServerToClientGameRoomsEvents,
} from '@contracts/sockets/chat/gameRooms.schema';

const gameRoomsManager = new GameRoomsManager();

//interface Client

export function registerGameRoomSocket(
  nsp: Namespace
) {
  nsp.on('connection', (socket: Socket<ClientToServerGameRoomsEvents, ServerToClientGameRoomsEvents>) => {
    console.log("[ GameRoom ] client connection: " + socket.id);
    socket.nsp.to(socket.id).emit("gameRoom:debug:state", "none");
    socket.nsp.to(socket.id).emit("gameRoom:debug:msg", "first connection, no reconection");
    socket.nsp.to(socket.id).emit("gameRoom:error:msg", "none");
    console.log("[ GameRoom ] " + socket.id);
    socket.on("gameRoom:teammate:joinAny", () => {
      console.log("[ GameRoom ] join request.");
      let gameRoom = gameRoomsManager.joinUserToAnyGameRoom(socket.id);
      socket.join("GameRoom-" + gameRoom.id.toString());
      socket.to("GameRoom-" + gameRoom.id.toString()).emit("gameRoom:room:joined", socket.id);
      socket.nsp.to(socket.id).emit("gameRoom:teammate:joinAny:ack", gameRoom);
    });
    socket.on("gameRoom:teammate:leave", () => {
      socket.leave("GameRoom-" + currentGameRoomId.toString());
      socket.to("GameRoom-" + currentGameRoomId.toString()).emit("gameRoom:teammate:left", socket.id);
    });
  });
}

