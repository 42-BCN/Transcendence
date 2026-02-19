'use client';

import { useState } from 'react';
import { SocketManager } from '@/lib/sockets';
import { RobotsScene } from '@/features/robots';

type Character = {
  id: string;
  position: [number, number, number];
  target?: [number, number, number];
  color: string;
};

export default function ThreejsPage() {
  const [characters, setCharacters] = useState<Character[]>([]);
  return (
    <div className="flex">
      <div className="h-screen flex-grow">
        <SocketManager onCharacters={setCharacters} />
        <RobotsScene characters={characters} />
      </div>
    </div>
  );
}
