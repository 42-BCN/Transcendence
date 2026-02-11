import type * as THREE from 'three';
import { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import { SkeletonUtils } from 'three-stdlib';

type GltfModel = {
  scene: THREE.Group;
  animations: THREE.AnimationClip[];
};

export function useClonedGltfModel(url: string) {
  const gltf = useGLTF(url) as unknown as GltfModel;

  const clone = useMemo(() => SkeletonUtils.clone(gltf.scene) as THREE.Group, [gltf.scene]);

  return { animations: gltf.animations, clone };
}
