'use client';

import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useState } from 'react';

export type RoomsStore = {
  roomState: gameRoomState;
  setRoomState: (state: gameRoomState) => void;
};

export const RoomStateEmpty: RoomsState = {
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
  const data = {
    roomState: roomState,
    setRoomState: setRoomState,
  };

  return (
    <RoomsStoreContext.Provider value={data}>{children}</RoomsStoreContext.Provider>
  );
}

