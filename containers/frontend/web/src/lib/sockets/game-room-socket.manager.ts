'use client';

import type { Namespace, Socket } from 'socket.io';
import type {
  ClientToServerGameRoomsEvents,
  ServerToClientGameRoomsEvents,
} from '@contracts/sockets/chat/gameRooms.schema';
import { gameRoomSocket } from '@/lib/sockets/socket';
import type { gameRoomState } from '@contracts/sockets/game/game.schema';

export function GameRoomSocketJoinAnyRoom() {
  gameRoomSocket.emit("gameRoom:teammate:joinAny");
}

export function makeGameRoomSocketLeaveRoom(gameRoomId: number) {
  return () => {
    gameRoomSocket.emit("gameRoom:teammate:leave", gameRoomId);
  };
}

export function initGameRoomSocketHandelers(
  setGameRoomState: (text: gameRoomState) => void,
  setDebugMsg: (text: string) => void,
  setDebugError: (text: string) => void)
{
  gameRoomSocket.on('gameRoom:debug:msg', (text: string) => {
    console.log('[ gameRoom ] debug msg');
    console.log('the debug msg is: ' + text);
    setDebugMsg("debug msg: " + text);
  });
  gameRoomSocket.on('gameRoom:error:msg', (text: string) => {
    console.log('[ gameRoom ] error msg');
    console.log('the error msg is: ' + text);
    setDebugError("error msg: " + text);
  });

  gameRoomSocket.on('gameRoom:room:update', (gameRoom: gameRoomState) => {
    console.log("[ gameRoom ] connection to room succesfulll.");
    console.log("[ gameRoom ] state: ", gameRoom);

    setGameRoomState(gameRoom);
  });

  gameRoomSocket.on('gameRoom:room:joined', (gameRoom: gameRoomState, userId: string) => {
    console.log("[ gameRoom ] joining a game room", gameRoom, userId);
    setGameRoomState(gameRoom);
    setDebugMsg("new user joined: " + userId);
  });
  gameRoomSocket.connect();
  console.log("[ GameRoom ] connected.");
}

export function deinitGameRoomSocketHandelers() {

}

