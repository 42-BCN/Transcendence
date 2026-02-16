import { create } from 'zustand';

type GameState = {
  score: number;
  increment: () => void;
  reset: () => void;
};

export const useGameStore = create<GameState>((set) => ({
  score: 0,
  increment: () => set((state) => ({ score: state.score + 1 })),
  reset: () => set({ score: 0 }),
}));
