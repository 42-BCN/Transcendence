import type { Namespace, Socket } from 'socket.io';
import { GameRoomsManager } from './GameRoomsManager.ts';
import type {
  ClientToServerGameRoomsEvents,
  ServerToClientGameRoomsEvents,
} from '@contracts/sockets/chat/gameRooms.schema';

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
  console.log("[GameRoom Socket] registering the socket!!");
  nsp.on('connection', 
      (socket: Socket) => {
    let currentGameRoomId: number | undefined = undefined;
    console.log("[GameRoom Socket] look at me");
    socket.on("gameRoom:teammate:joinAny", () => {
      console.log("[GameRoom Socket] called the join any room");
      //  TODO: manage errors regarding incorrect actions.i
      let gameRoomId = gameRoomsManager.joinUserToAnyGameRoom(socket.id);
      console.log(gameRoomId);
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
