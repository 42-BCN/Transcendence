'use client';

import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useRef } from 'react';
import { useStore } from 'zustand';

import {
  createGameInvitationsStore,
  type GameInvitationsStore,
} from './game-invitations.store';
import type { GameInvitationsState } from './game-invitations.types';
import { REALTIME_IDENTITY_CHANGED_EVENT } from '@/lib/sockets/realtime-session-bridge';

export const GameInvitationsStoreContext = createContext<GameInvitationsStore | null>(null);

export function GameInvitationsProvider({ children }: { children: ReactNode }) {
  const storeRef = useRef<GameInvitationsStore | null>(null);

  if (!storeRef.current) {
    storeRef.current = createGameInvitationsStore();
  }

  useEffect(() => {
    const store = storeRef.current;
    if (!store) return;

    const handleIdentityChanged = () => {
      store.getState().resetInvitationState();
    };

    window.addEventListener(REALTIME_IDENTITY_CHANGED_EVENT, handleIdentityChanged);
    return () => {
      window.removeEventListener(REALTIME_IDENTITY_CHANGED_EVENT, handleIdentityChanged);
    };
  }, []);

  return (
    <GameInvitationsStoreContext.Provider value={storeRef.current}>
      {children}
    </GameInvitationsStoreContext.Provider>
  );
}

export function useGameInvitationsStore<T>(selector: (state: GameInvitationsState) => T): T {
  const store = useContext(GameInvitationsStoreContext);

  if (!store) {
    throw new Error('useGameInvitationsStore must be used inside GameInvitationsProvider');
  }

  return useStore(store, selector);
}
