import { Canvas } from '@react-three/fiber';
import type { ReactNode } from 'react';
import { Grid, OrbitControls } from '@react-three/drei';

export function ThreejsScene({ children }: { children: ReactNode }) {
  return (
    <Canvas
      className="w-full h-full"
      camera={{
        position: [8, 8, 8], // 👈 isometric angle
        fov: 45,
        near: 0.1,
        far: 100,
      }}
    >
      {/* Lights */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 15, 10]} intensity={1.2} castShadow />
      <directionalLight position={[-8, 6, -8]} intensity={0.6} />
      <pointLight position={[0, 8, -10]} intensity={0.4} />

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

      {children}
    </Canvas>
  );
}
