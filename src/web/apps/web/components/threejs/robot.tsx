import * as THREE from 'three';
import React from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';
import { SkeletonUtils } from 'three-stdlib';

type ActionName =
  | 'RobotArmature|Robot_Dance'
  | 'RobotArmature|Robot_Death'
  | 'RobotArmature|Robot_Idle'
  | 'RobotArmature|Robot_Jump'
  | 'RobotArmature|Robot_No'
  | 'RobotArmature|Robot_Punch'
  | 'RobotArmature|Robot_Running'
  | 'RobotArmature|Robot_Sitting'
  | 'RobotArmature|Robot_Standing'
  | 'RobotArmature|Robot_ThumbsUp'
  | 'RobotArmature|Robot_Walking'
  | 'RobotArmature|Robot_WalkJump'
  | 'RobotArmature|Robot_Wave'
  | 'RobotArmature|Robot_Yes';

type Props = JSX.IntrinsicElements['group'] & {
  color?: THREE.ColorRepresentation;
  animation?: ActionName;
};

// eslint-disable-next-line max-lines-per-function
export function Robot({
  color = 'orange',
  animation = 'RobotArmature|Robot_Idle',
  ...props
}: Props) {
  const group = React.useRef<THREE.Group>(null);

  const gltf = useGLTF('/models/Animated Robot.glb') as unknown as {
    scene: THREE.Group;
    animations: THREE.AnimationClip[];
  };

  const clone = React.useMemo(() => SkeletonUtils.clone(gltf.scene) as THREE.Group, [gltf.scene]);

  // ✅ recolor only "Main" materials, per instance, safely
  React.useLayoutEffect(() => {
    const cache = new Map<THREE.Material, THREE.Material>();
    const tint = new THREE.Color(color);

    const shouldTint = (mat: THREE.Material) => {
      const n = mat.name ?? '';
      return n === 'Main' || n.includes('Main');
    };

    const cloneOne = (mat: THREE.Material) => {
      let m = cache.get(mat);
      if (!m) {
        m = mat.clone();
        (m as any).skinning = true;
        cache.set(mat, m);
      }
      if (shouldTint(mat) && 'color' in (m as any) && (m as any).color) {
        (m as any).color.set(tint);
        m.needsUpdate = true;
      }
      return m;
    };

    clone.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (!(mesh as any).isMesh && !(mesh as any).isSkinnedMesh) return;
      if (!mesh.material) return;

      if (Array.isArray(mesh.material)) {
        mesh.material = mesh.material.map(cloneOne);
      } else {
        mesh.material = cloneOne(mesh.material);
      }
    });
  }, [clone, color]);

  const { actions } = useAnimations(gltf.animations, group);

  React.useEffect(() => {
    const action = actions?.[animation];
    if (!action) return;

    action.reset().fadeIn(0.2).play();
    return () => {
      action.fadeOut(0.2);
    };
  }, [animation, actions]);

  return (
    <group ref={group} {...props} dispose={null}>
      <primitive object={clone} />
    </group>
  );
}

useGLTF.preload('/models/Animated Robot.glb');
