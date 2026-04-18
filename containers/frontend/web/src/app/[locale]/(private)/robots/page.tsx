'use client';

import { useState } from 'react';
import { RobotsSocketManager } from '@/lib/sockets';
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
    <div className="min-h-screen w-full">
      <RobotsSocketManager onRobots={setCharacters} />
      <RobotsScene characters={characters} />
    </div>
  );
}
