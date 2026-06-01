import type { Namespace, Socket } from 'socket.io';
import { GameRoomsManager } from './GameRoomsManager.ts';
import type {
  ClientToServerGameRoomsEvents,
  ServerToClientGameRoomsEvents,
} from '@contracts/sockets/chat/chat.schema';

const gameRoomsManager = new GameRoomsManager();

interface ClientToServerGameRoomEvents {
  'gameRoom:teammate:joinAny': () => void;
  'gameRoom:teammate:join': (gameRoomId: number) => void;
  'gameRoom:teammate:leave': () => void;
};

//interface Client

export function registerGameRoomSocket(
  nsp: Namespace,
) {
  nsp.on('connection', 
      (socket: Socket<ClientToServerGameRoomEvents, ServerToClientGameRoomsEvents>) => {
    let currentGameRoomId: number | undefined = undefined;
    socket.on("gameRoom:teammate:joinAny", () => {
      //  TODO: manage errors regarding incorrect actions.
      let gameRoomId = gameRoomsManager.joinUserToAnyGameRoom(socket.id);
      socket.join(gameRoomId.toString());
      socket.to(gameRoomId.toString()).emit("gameRoom:teammate:joined", socket.id);
      currentGameRoomId = gameRoomId;
    });
    // TODO: implement the other messages types.
    socket.on("gameRoom:teammate:join", (gameRoomId: number) => {
      socket.join(gameRoomId.toString());
      socket.to(gameRoomId.toString()).emit("gameRoom:teammate:joined", socket.id);
      currentGameRoomId = gameRoomId;
    });
    socket.on("gameRoom:teammate:leave", () => {
      socket.leave(currentGameRoomId.toString());
      socket.to(currentGameRoomId.toString()).emit("gameRoom:teammate:left", socket.id);
      currentGameRoomId = undefined;
    });
  });
}
