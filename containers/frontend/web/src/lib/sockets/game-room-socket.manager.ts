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

export function GameRoomSocketJoin(formData: FormData) {
  const gameRoomId = String(formData.get('') ?? '');
  gameRoomSocket.emit("gameRoom:teammate:join", Number(formData.get("gameRoomId")));
}

export function GameRoomSocketLeaveRoom() {
  gameRoomSocket.emit("gameRoom:teammate:leave");
}

export function GameRoomSocketPrintDebug() {
  gameRoomSocket.emit("gameRoom:teammate:printDebug");
}


export function initGameRoomSocketHandelers(
  setDebugState: (text: gameRoomState) => void,
  setDebugMsg: (text: string) => void,
  setDebugError: (text: string) => void)
{
  gameRoomSocket.on('gameRoom:room:update', (state: gameRoomState) => {
    console.log('[ gameRoom ] debug state');
    console.log('the debug state is: ', state);
    setDebugState(state);
  });
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

  gameRoomSocket.on('gameRoom:teammate:joinAny:ack', (gameRoom: gameRoomState) => {
    console.log("[ gameRoom ] connection to room succesfulll.");
    console.log("[ gameRoom ] state: ", gameRoom);
    setDebugState(gameRoom);
  });

  gameRoomSocket.on('gameRoom:room:joined', (username: string) => {
    console.log("[ gameRoom ] user joining this game room: ", username);
    setDebugMsg("new user joined: " + username);
  });
  gameRoomSocket.on('gameRoom:room:left', (username: string) => {
    console.log("[ gameRoom ] user leaving gaem room: ", username);
    setDebugMsg("user left: " + username);
  });


  gameRoomSocket.connect();
  console.log("[ GameRoom ] connected.");
}

export function deinitGameRoomSocketHandelers() {

}

