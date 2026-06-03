'use client';

import type { Namespace, Socket } from 'socket.io';
import type {
  ClientToServerGameRoomsEvents,
  ServerToClientGameRoomsEvents,
} from '@contracts/sockets/chat/gameRooms.schema';
import { gameRoomSocket } from '@/lib/sockets/socket';
import type { gameRoomState} from '@contracts/sockets/game/game.schema';

export function initGameRoomSocketManager(setDebugInfo: (text: string) => void) {
  console.log("[ gameRoom ] initing");
  console.log(gameRoomSocket);
  gameRoomSocket.on('gameRoom:room:joined', (gameRoom: gameRoomState) => {
    console.log("[ gameRoom ] joining a game room", gameRoom);
    console.log("[ gameRoom ] joined a room at: " + gameRoom.id.toString());
    setDebugInfo("joined a room at: " + gameRoom.id.toString());
  });
  gameRoomSocket.connect();
  gameRoomSocket.emit("gameRoom:teammate:joinAny");
  console.log("[ GameRoom ] connected.");
  console.log(gameRoomSocket);
  setTimeout(() => { console.log(gameRoomSocket) }, 5000)
//  gameRoomSocket.emit("gameRoom:teammate:joinAny");
}

export function deinitGameRoomSocketManager() {

}

