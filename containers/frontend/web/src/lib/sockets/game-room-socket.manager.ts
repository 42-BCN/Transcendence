'use client';

import { ensureChatSessionIdentity, gameRoomSocket } from '@/lib/sockets/socket';
import type { gameRoomState } from '@/contracts/sockets/rooms/gameRooms.schema';

export function GameRoomSocketJoinAnyRoom() {
  gameRoomSocket.emit('gameRoom:teammate:joinAny');
}

export function GameRoomSocketJoin(formData: FormData) {
  gameRoomSocket.emit('gameRoom:teammate:join', Number(formData.get('gameRoomId')));
}

export function GameRoomSocketLeaveRoom() {
  gameRoomSocket.emit('gameRoom:teammate:leave');
}

export function GameRoomSocketPrintDebug() {
  gameRoomSocket.emit('gameRoom:teammate:printDebug');
}


export function initGameRoomSocketHandelers(
  setDebugState: (text: gameRoomState) => void,
  setDebugMsg: (text: string) => void,
  setDebugError: (text: string) => void,
): () => void {
  const handleRoomUpdate = (state: gameRoomState) => {
    console.log('[ gameRoom ] room update', state);
    setDebugState(state);
  };
  const handleDebugMsg = (text: string) => {
    console.log('[ gameRoom ] debug msg:', text);
    setDebugMsg(`debug msg: ${text}`);
  };
  const handleErrorMsg = (text: string) => {
    console.log('[ gameRoom ] error msg:', text);
    setDebugError(`error msg: ${text}`);
  };
  const handleRoomJoined = (username: string) => {
    console.log('[ gameRoom ] user joined:', username);
    setDebugMsg(`new user joined: ${username}`);
  };
  const handleRoomLeft = (username: string) => {
    console.log('[ gameRoom ] user left:', username);
    setDebugMsg(`user left: ${username}`);
  };

  gameRoomSocket.on('gameRoom:room:update', handleRoomUpdate);
  gameRoomSocket.on('gameRoom:debug:msg', handleDebugMsg);
  gameRoomSocket.on('gameRoom:error:msg', handleErrorMsg);
  gameRoomSocket.on('gameRoom:room:joined', handleRoomJoined);
  gameRoomSocket.on('gameRoom:room:left', handleRoomLeft);

  let isMounted = true;

  void ensureChatSessionIdentity()
    .catch((error) => {
      console.error('[ GameRoom ] failed to initialize guest session identity', error);
    })
    .finally(() => {
      if (!isMounted) return;
      gameRoomSocket.connect();
      const urlParams = new URLSearchParams(window.location.search);
      const roomId = Number(urlParams.get('roomId'));
      if (roomId > 0) {
        gameRoomSocket.emit('gameRoom:teammate:join', roomId);
      }
      console.log('[ GameRoom ] connected. roomId from URL:', roomId || 'none');
    });

  return () => {
    isMounted = false;
    gameRoomSocket.off('gameRoom:room:update', handleRoomUpdate);
    gameRoomSocket.off('gameRoom:debug:msg', handleDebugMsg);
    gameRoomSocket.off('gameRoom:error:msg', handleErrorMsg);
    gameRoomSocket.off('gameRoom:room:joined', handleRoomJoined);
    gameRoomSocket.off('gameRoom:room:left', handleRoomLeft);
    gameRoomSocket.disconnect();
  };
}
