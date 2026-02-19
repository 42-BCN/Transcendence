'use client';

import { FloorClickToMove, ThreejsScene } from '@/lib/threejs';
import { CharacterEntity } from './character-entity';

type Character = {
  id: string;
  position: [number, number, number];
  target?: [number, number, number];
  color: string;
};

export function RobotsScene({ characters }: { characters: Character[] }) {
  return (
    <ThreejsScene>
      <FloorClickToMove mapSize={10} cellSize={1} />
      {characters.map((c) => (
        <CharacterEntity key={c.id} c={c} />
      ))}
    </ThreejsScene>
  );
}
