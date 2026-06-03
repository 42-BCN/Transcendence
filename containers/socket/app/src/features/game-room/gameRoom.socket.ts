import type { Namespace, Socket } from 'socket.io';
import { GameRoomsManager } from './GameRoomsManager.ts';
import type {
  ClientToServerGameRoomsEvents,
  ServerToClientGameRoomsEvents,
} from '@contracts/sockets/chat/gameRooms.schema';

const gameRoomsManager = new GameRoomsManager();

//interface Client

export function registerGameRoomSocket(
  nsp: Namespace,
) {
  nsp.on('connection', 
      (socket: Socket<ClientToServerGameRoomsEvents, ServerToClientGameRoomsEvents>) => {
    socket.on("gameRoom:teammate:joinAny", () => {
      console.log("[ GameRoom ] join request.");
      let gameRoom = gameRoomsManager.joinUserToAnyGameRoom(socket.id);
	  console.log("hint1");
	  socket.emit("gameRoom:room:joined", gameRoom);
	  console.log("hint2");
      socket.join("GameRoom-" + gameRoom.id.toString());
      socket.to("GameRoom-" + gameRoom.id.toString()).emit("gameRoom:room:joined", gameRoom);
    });
    socket.on("gameRoom:teammate:leave", () => {
      socket.leave("GameRoom-" + currentGameRoomId.toString());
      socket.to(currentGameRoomId.toString()).emit("gameRoom:teammate:left", socket.id);
    });
  });
}
