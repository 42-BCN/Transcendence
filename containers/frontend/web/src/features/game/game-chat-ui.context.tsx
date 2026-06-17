'use client';

import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

type GameChatUiContextValue = {
  isChatOpen: boolean;
  setChatOpen: (open: boolean) => void;
};

const GameChatUiContext = createContext<GameChatUiContextValue | null>(null);

export function GameChatUiProvider({ children }: { children: ReactNode }) {
  const [isChatOpen, setChatOpen] = useState(true);

  const value = useMemo(
    () => ({
      isChatOpen,
      setChatOpen,
    }),
    [isChatOpen],
  );

  return <GameChatUiContext.Provider value={value}>{children}</GameChatUiContext.Provider>;
}

export function useGameChatUi() {
  return useContext(GameChatUiContext);
}
