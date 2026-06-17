'use client';

import type { ReactNode } from 'react';
import { createContext, useEffect, useState } from 'react';
import type { gameRoomState } from '@/contracts/sockets/rooms/gameRooms.schema';
import type { PlayerState } from "@/contracts/sockets/rooms/gameRooms.schema";
import { REALTIME_IDENTITY_CHANGED_EVENT } from '@/lib/sockets/realtime-session-bridge';

const ACTIVE_ROOM_STORAGE_KEY = 'transcendence:active-room-id';
const ROOM_STATE_STORAGE_KEY = 'transcendence:room-state';

export type RoomsStore = {
  roomState: gameRoomState;
  setRoomState: (state: gameRoomState) => void;
  replaceTeammateName: (args: {
    nextUserName: string;
    previousUserName?: string | null;
    nextMemberKey?: string | null;
  }) => void;
};

export const RoomStateEmpty: gameRoomState = {
  id: 0,
  isGameRoomFull: false,
  teammates: [],
};

export const RoomsStoreContext = createContext<RoomsStore | null>(null);

function readStoredRoomState(): gameRoomState {
  if (typeof window === 'undefined') {
    return RoomStateEmpty;
  }

  const raw = window.localStorage.getItem(ROOM_STATE_STORAGE_KEY);
  if (!raw) {
    return RoomStateEmpty;
  }

  try {
    const parsed = JSON.parse(raw) as gameRoomState;
    if (!parsed || typeof parsed.id !== 'number' || !Array.isArray(parsed.teammates)) {
      return RoomStateEmpty;
    }

    return {
      id: parsed.id,
      isGameRoomFull: Boolean(parsed.isGameRoomFull),
      teammates: parsed.teammates,
    };
  } catch {
    return RoomStateEmpty;
  }
}

export function RoomsProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [roomState, setRoomState] = useState<gameRoomState>(RoomStateEmpty);

  useEffect(() => {
    setRoomState(readStoredRoomState());
  }, []);

  useEffect(() => {
    if (roomState.id > 0) {
      window.sessionStorage.setItem(ACTIVE_ROOM_STORAGE_KEY, String(roomState.id));
      window.localStorage.setItem(ROOM_STATE_STORAGE_KEY, JSON.stringify(roomState));
      return;
    }

    window.sessionStorage.removeItem(ACTIVE_ROOM_STORAGE_KEY);
    window.localStorage.removeItem(ROOM_STATE_STORAGE_KEY);
  }, [roomState]);

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key !== ROOM_STATE_STORAGE_KEY) {
        return;
      }

      setRoomState(readStoredRoomState());
    };

    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  useEffect(() => {
    const handleIdentityChanged = () => {
      setRoomState(RoomStateEmpty);
      window.localStorage.removeItem(ROOM_STATE_STORAGE_KEY);
    };

    window.addEventListener(REALTIME_IDENTITY_CHANGED_EVENT, handleIdentityChanged);
    return () => {
      window.removeEventListener(REALTIME_IDENTITY_CHANGED_EVENT, handleIdentityChanged);
    };
  }, []);

  const replaceTeammateName: RoomsStore['replaceTeammateName'] = ({
    nextUserName,
    previousUserName,
    nextMemberKey,
  }) => {
    setRoomState((currentState) => {
      const teammates = currentState.teammates.map((teammate) => {
        const matchesMemberKey = nextMemberKey && teammate.userId === nextMemberKey;
        const matchesPreviousUserName = previousUserName && teammate.userName === previousUserName;

        if (!matchesMemberKey && !matchesPreviousUserName) {
          return teammate;
        }

        return {
          ...teammate,
          userName: nextUserName,
          ...(matchesPreviousUserName && nextMemberKey ? { userId: nextMemberKey } : {}),
        };
      });

      return {
        ...currentState,
        teammates,
      };
    });
  };

  const data = {
    roomState,
    setRoomState,
    replaceTeammateName,
  };

  return (
    <RoomsStoreContext.Provider value={data}>{children}</RoomsStoreContext.Provider>
  );
}
