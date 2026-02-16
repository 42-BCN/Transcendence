import type * as THREE from 'three';
import { useEffect } from 'react';
import type { RefObject } from 'react';
import { useAnimations } from '@react-three/drei';

export function usePlayAnimation<T extends string>(
  animations: THREE.AnimationClip[],
  groupRef: RefObject<THREE.Object3D>,
  animation: T,
) {
  const { actions } = useAnimations(animations, groupRef);

  useEffect(() => {
    const action = actions?.[animation];
    if (!action) return;

    action.reset().fadeIn(0.2).play();
    return () => {
      action.fadeOut(0.2);
    };
  }, [actions, animation]);
}
