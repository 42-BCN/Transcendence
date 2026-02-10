'use client';

import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { CharacterEntity } from '@/components/threejs/characterEntity';
import { Grid, OrbitControls } from '@react-three/drei';
import { SocketManager } from '@/components/threejs/SocketManager';
import { socket } from '@/components/threejs/socket';

type Character = {
  id: string;
  position: [number, number, number];
  target?: [number, number, number];
  color: string;
};

function FloorClickToMove({ mapSize = 10, cellSize = 1 }: { mapSize?: number; cellSize?: number }) {
  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, 0, 0]}
      onPointerDown={(e) => {
        e.stopPropagation();

        // Intersection point with the plane
        const p = e.point; // THREE.Vector3 in world coords

        // Clamp to board bounds (centered)
        const half = mapSize / 2;
        const clampedX = Math.max(-half, Math.min(half, p.x));
        const clampedZ = Math.max(-half, Math.min(half, p.z));

        // Snap to grid cells
        const snappedX = Math.round(clampedX / cellSize) * cellSize;
        const snappedZ = Math.round(clampedZ / cellSize) * cellSize;

        // Emit to server (Y stays 0)
        socket.emit('moveTo', [snappedX, 0, snappedZ]);
      }}
    >
      {/* Plane sized to your grid */}
      <planeGeometry args={[mapSize, mapSize]} />

      {/* Invisible but still clickable */}
      <meshStandardMaterial transparent opacity={0} />
    </mesh>
  );
}

// eslint-disable-next-line max-lines-per-function
export default function threejsPage() {
  const [characters, setCharacters] = useState<Character[]>([]);
  return (
    <div className="w-screen h-screen">
      <SocketManager onCharacters={setCharacters} />
      <Canvas
        className="w-full h-full"
        camera={{
          position: [8, 8, 8], // 👈 isometric angle
          fov: 45,
          near: 0.1,
          far: 100,
        }}
      >
        <ambientLight intensity={0.6} />

        {/* Main light (sun) */}
        <directionalLight position={[10, 15, 10]} intensity={1.2} castShadow />

        {/* Fill light (softens shadows) */}
        <directionalLight position={[-8, 6, -8]} intensity={0.6} />

        {/* Rim / back light (adds depth) */}
        <pointLight position={[0, 8, -10]} intensity={0.4} />
        <FloorClickToMove mapSize={10} cellSize={1} />
        {/* Isometric-style controls */}
        <OrbitControls
          target={[0, 0, 0]}
          enablePan={false}
          enableDamping
          minPolarAngle={Math.PI / 6} // don't go too top-down
          maxPolarAngle={Math.PI / 2.05} // don't go below the ground
          minAzimuthAngle={-Math.PI / 4} // limit left-right rotation
          maxAzimuthAngle={Math.PI / 4}
        />

        {/* Floor */}
        <Grid
          args={[10, 10]}
          position={[0, 0, 0]}
          cellColor="#6b7280" // small lines (gray-500)
          sectionColor="#e5e7eb" // big lines (gray-200)
        />

        {/* ✅ Render ALL characters */}
        {characters.map((c) => (
          <CharacterEntity key={c.id} c={c} />
        ))}
      </Canvas>
    </div>
  );
}
