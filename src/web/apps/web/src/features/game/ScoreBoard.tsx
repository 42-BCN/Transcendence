'use client';

import { useGameStore } from './store';

export function ScoreBoard() {
  const score = useGameStore((s) => s.score);
  const increment = useGameStore((s) => s.increment);

  return (
    <div>
      <p>Score: {score}</p>
      <button onClick={increment}>+1</button>
    </div>
  );
}
