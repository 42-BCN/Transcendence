import type * as THREE from 'three';
import React from 'react';
import {
  useClonedGltfModel,
  useTintMainMaterials,
  usePlayAnimation,
} from '@/components/threejs/hooks';

export type RobotActionName =
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

type Props = {
  color?: THREE.ColorRepresentation;
  animation?: RobotActionName;
} & React.ComponentProps<'group'>;

export function Robot({
  color = 'orange',
  animation = 'RobotArmature|Robot_Idle',
  ...props
}: Props) {
  const group = React.useRef<THREE.Group>(null);

  const { clone, animations } = useClonedGltfModel('/models/Animated Robot.glb');

  useTintMainMaterials(clone, color);

  usePlayAnimation(animations, group, animation);

  return (
    <group ref={group} {...props} dispose={null}>
      <primitive object={clone} />
    </group>
  );
}
