'use client';

import { useState } from 'react';
import { SocketManager } from '@/lib/sockets';
import { RobotsScene } from '@/components/features/robots';

type Character = {
  id: string;
  position: [number, number, number];
  target?: [number, number, number];
  color: string;
};

export default function threejsPage() {
  const [characters, setCharacters] = useState<Character[]>([]);
  return (
    <div className="w-screen h-screen">
      <SocketManager onCharacters={setCharacters} />
      <RobotsScene characters={characters} />
    </div>
  );
}
