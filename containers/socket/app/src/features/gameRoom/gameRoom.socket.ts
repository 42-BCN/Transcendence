import type { Namespace, Socket } from 'socket.io';
import { GameRoomsManager } from './GameRoomsManager.ts';

const gameRoomsManager = new GameRoomsManager();

export function registerGameRoomSocket(
  nsp: Namespace,
) {
  nsp.on('connection', (socket: Socket) => {
    let currentGameRoomId: number | undefined = undefined;
    socket.on("joinAnyGameRoom", (cb) => {
      //  TODO: manage errors regarding incorrect actions.
      let gameRoomId = gameRoomsManager.joinUserToAnyGameRoom(socket.id);
      socket.join(gameRoomId.toString());
      socket.to(gameRoomId.toString()).emit("room:teammate:joined", socket.id);
      currentGameRoomId = gameRoomId;
      cb(`joined the room: ${gameRoomId}`);
    });
    socket.on("joinGameRoom", (gameRoomId: number) => {
      socket.join(gameRoomId.toString());
      socket.to(gameRoomId.toString()).emit("room:teammate:joined", socket.id);
      currentGameRoomId = gameRoomId;
      cb(`joined the room: ${gameRoomId}`);
    });
    socket.on("leaveGameRoom", () => {
      socket.leave(currentGameRoomId.toString());
      socket.to(currentGameRoomId.toString()).emit("room:teammate:left", socket.id);
      currentGameRoomId = undefined;
    });
  });
}
