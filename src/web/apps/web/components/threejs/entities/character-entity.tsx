import * as THREE from 'three';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Robot } from './robot';
import type { RobotActionName } from './robot';
import { useMoveTo } from '@/components/threejs/hooks';

type Character = {
  id: string;
  position: [number, number, number];
  target?: [number, number, number];
  color: string;
};

type MovementState = 'idle' | 'moving';
const IDLE: RobotActionName = 'RobotArmature|Robot_Idle';
const RUN: RobotActionName = 'RobotArmature|Robot_Running';
const SPEED = 2.2;
const EPSILON = 0.05;

export function CharacterEntity({ c }: { c: Character }) {
  const ref = useRef<THREE.Group>(null);

  const [state, setState] = useState<MovementState>('idle');
  const animation: RobotActionName = state === 'moving' ? RUN : IDLE;

  const target = useMemo(
    () => new THREE.Vector3(...(c.target ?? c.position)),
    [c.target, c.position],
  );

  useEffect(() => {
    if (!ref.current) return;
    ref.current.position.set(...c.position);
  }, [c.position]);

  const isMoving = useMoveTo(ref, target, { speed: SPEED, epsilon: EPSILON, faceDirection: true });

  useEffect(() => {
    const next: MovementState = isMoving ? 'moving' : 'idle';
    setState((prev) => (prev === next ? prev : next));
  }, [isMoving]);

  return (
    <group ref={ref}>
      <Robot color={c.color} scale={0.2} animation={animation} />
    </group>
  );
}
