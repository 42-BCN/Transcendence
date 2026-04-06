'use client';

import { useEffect } from 'react';
import { useGameStore } from './game.zustand';

/**
 * Hook to initialize and cleanup game socket listeners
 * Call this once in your app, typically in a layout or root component
 */
export function useGameSocketManager() {
  const initSocketListeners = useGameStore((state) => state.initSocketListeners);
  const cleanupSocketListeners = useGameStore((state) => state.cleanupSocketListeners);

  useEffect(() => {
    initSocketListeners();

    return () => {
      cleanupSocketListeners();
    };
  }, [initSocketListeners, cleanupSocketListeners]);
}

/**
 * Hook to access game state and actions
 * Use this in components that need access to game state
 */
export function useGame() {
  const gameState = useGameStore();
  return gameState;
}
