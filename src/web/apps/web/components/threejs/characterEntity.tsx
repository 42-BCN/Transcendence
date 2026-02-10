import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Robot } from '@/components/threejs/robot';

type Character = {
  id: string;
  position: [number, number, number];
  target?: [number, number, number];
  color: string;
};

export function CharacterEntity({ c }: { c: Character }) {
  const ref = useRef<THREE.Group>(null);

  const speed = 2.2;
  const epsilon = 0.05;

  const [anim, setAnim] = useState('RobotArmature|Robot_Idle');

  const target = useMemo(
    () => new THREE.Vector3(...(c.target ?? c.position)),
    [c.target, c.position],
  );

  useEffect(() => {
    if (!ref.current) return;
    ref.current.position.set(...c.position);
  }, [c.position]);

  useFrame((_, dt) => {
    if (!ref.current) return;

    const pos = ref.current.position;
    const dist = pos.distanceTo(target);

    if (dist > epsilon) {
      // Moving
      const dir = target.clone().sub(pos).normalize();
      pos.addScaledVector(dir, speed * dt);

      const angle = Math.atan2(dir.x, dir.z);
      ref.current.rotation.y = angle;

      if (anim !== 'RobotArmature|Robot_Running') {
        setAnim('RobotArmature|Robot_Running');
      }
    } else {
      if (anim !== 'RobotArmature|Robot_Idle') {
        setAnim('RobotArmature|Robot_Idle');
      }
    }
  });

  return (
    <group ref={ref}>
      <Robot
        color={c.color}
        scale={0.2}
        animation={anim} // ✅ passed here
      />
    </group>
  );
}
