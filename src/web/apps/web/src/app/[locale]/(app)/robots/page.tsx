'use client';

import { useState } from 'react';
import { SocketManager } from '@/lib/sockets';
import { RobotsScene } from '@/components/features/robots';
import { ScoreBoard } from '@/features/game';

type Character = {
  id: string;
  position: [number, number, number];
  target?: [number, number, number];
  color: string;
};

export default function threejsPage() {
  const [characters, setCharacters] = useState<Character[]>([]);
  return (
    <div className="flex">
      <div className="">
        <ScoreBoard></ScoreBoard>
      </div>
      <div className="h-screen flex-grow">
        <SocketManager onCharacters={setCharacters} />
        <RobotsScene characters={characters} />
      </div>
    </div>
  );
}
