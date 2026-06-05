import { Canvas } from '@react-three/fiber';
import { type ReactNode, useMemo } from 'react';
import { Grid, OrbitControls } from '@react-three/drei';

function isWebGLAvailable(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

function WebGLFallback() {
  return (
    <div className="w-full h-screen h-[100dvh] flex items-center justify-center bg-bg-secondary rounded-xl">
      <div className="text-center p-8 max-w-md">
        <p className="font-heading-sm text-text-primary mb-2">WebGL not available</p>
        <p className="font-body-sm text-text-secondary">
          Your browser does not support WebGL or hardware acceleration is disabled.
          Please enable hardware acceleration in your browser settings or try a different browser.
        </p>
      </div>
    </div>
  );
}

export function ThreejsScene({ children }: { children: ReactNode }) {
  const webglSupported = useMemo(() => {
    if (typeof window === 'undefined') return true;
    return isWebGLAvailable();
  }, []);

  if (!webglSupported) return <WebGLFallback />;

  return (
    <Canvas
      className="w-full h-screen h-[100dvh]"
      camera={{
        position: [8, 8, 8],
        fov: 45,
        near: 0.1,
        far: 100,
      }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 15, 10]} intensity={1.2} castShadow />
      <directionalLight position={[-8, 6, -8]} intensity={0.6} />
      <pointLight position={[0, 8, -10]} intensity={0.4} />

      <OrbitControls
        target={[0, 0, 0]}
        enablePan={false}
        enableDamping
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2.05}
        minAzimuthAngle={-Math.PI / 4}
        maxAzimuthAngle={Math.PI / 4}
      />

      <Grid
        args={[10, 10]}
        position={[0, 0, 0]}
        cellColor="#6b7280"
        sectionColor="#e5e7eb"
      />

      {children}
    </Canvas>
  );
}
