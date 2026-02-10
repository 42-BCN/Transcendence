'use client';

import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Robot } from '@/components/threejs/robot';
import { Grid, OrbitControls } from '@react-three/drei';

function Box(props) {
  // This reference will give us direct access to the mesh
  const meshRef = useRef();
  // Set up state for the hovered and active state
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);
  // Subscribe this component to the render-loop, rotate the mesh every frame
  useFrame((state, delta) => (meshRef.current.rotation.x += delta));
  // Return view, these are regular three.js elements expressed in JSX
  return (
    <mesh
      {...props}
      ref={meshRef}
      scale={active ? 3 : 2}
      onClick={() => setActive(!active)}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
    </mesh>
  );
}

export default function threejsPage() {
  return (
    <div className="w-screen h-screen">
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

        {/* Robot */}
        <Robot scale={0.2} position={[0, 0, 0]} />
      </Canvas>
    </div>
  );
}
