import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useRef, useState } from 'react';
import type { RefObject } from 'react';

type Options = {
  speed: number;
  epsilon?: number;
  faceDirection?: boolean;
};

export function useMoveTo(ref: RefObject<THREE.Object3D>, target: THREE.Vector3, opts: Options) {
  const { speed, epsilon = 0.05, faceDirection = true } = opts;

  const tmp = useRef(new THREE.Vector3());
  const prevMoving = useRef(false);
  const [isMoving, setIsMoving] = useState(false);

  useFrame((_, dt) => {
    const obj = ref.current;
    if (!obj) return;

    const pos = obj.position;
    const dist = pos.distanceTo(target);

    const moving = dist > epsilon;

    // ✅ only update React when it flips
    if (prevMoving.current !== moving) {
      prevMoving.current = moving;
      setIsMoving(moving);
    }

    if (!moving) return;

    const dir = tmp.current.copy(target).sub(pos).normalize();
    pos.addScaledVector(dir, speed * dt);

    if (faceDirection) {
      obj.rotation.y = Math.atan2(dir.x, dir.z);
    }
  });

  return isMoving;
}
