'use client';
import { useEffect, useContext } from 'react';

import {
  initGameRoomSocketHandelers,
} from '@/lib/sockets/game-room-socket.manager';
import { RoomsStoreContext } from './rooms-provider';

export function Rooms() {
  const roomContext = useContext(RoomsStoreContext);
  const setGameRoomStateCtx = roomContext?.setRoomState;

  useEffect(() => {
    if (!setGameRoomStateCtx) return;

    const cleanup = initGameRoomSocketHandelers(
      setGameRoomStateCtx,
      () => {},
      () => {},
    );
    return cleanup;
  }, [setGameRoomStateCtx]);

  return null;
}
