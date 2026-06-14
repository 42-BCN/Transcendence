'use client';

import type { ReactNode } from 'react';
import { createContext, useEffect, useState } from 'react';
import type { gameRoomState } from '@contracts/sockets/rooms/gameRooms.schema';

const ACTIVE_ROOM_STORAGE_KEY = 'transcendence:active-room-id';

export type RoomsStore = {
  roomState: gameRoomState;
  setRoomState: (state: gameRoomState) => void;
};

export const RoomStateEmpty: gameRoomState = {
  id: 0,
  isGameRoomFull: false,
  teammates: [],
};

export const RoomsStoreContext = createContext<RoomsStore | null>(null);

export function RoomsProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [roomState, setRoomState] = useState(RoomStateEmpty);

  useEffect(() => {
    if (roomState.id > 0) {
      window.sessionStorage.setItem(ACTIVE_ROOM_STORAGE_KEY, String(roomState.id));
      return;
    }

    window.sessionStorage.removeItem(ACTIVE_ROOM_STORAGE_KEY);
  }, [roomState.id]);

  const data = {
    roomState: roomState,
    setRoomState: setRoomState,
  };

  return (
    <RoomsStoreContext.Provider value={data}>{children}</RoomsStoreContext.Provider>
  );
}
