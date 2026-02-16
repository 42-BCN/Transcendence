import * as THREE from 'three';
import { useLayoutEffect } from 'react';

type MaterialWithColor = THREE.Material & { color?: THREE.Color };
type SkinnableMaterial = THREE.Material & { skinning?: boolean };

function isMeshLike(obj: THREE.Object3D): obj is THREE.Mesh | THREE.SkinnedMesh {
  return (obj as THREE.Mesh).isMesh === true || (obj as THREE.SkinnedMesh).isSkinnedMesh === true;
}

function materialHasColor(mat: THREE.Material): mat is MaterialWithColor {
  return (
    'color' in (mat as MaterialWithColor) && (mat as MaterialWithColor).color instanceof THREE.Color
  );
}

function isSkinnableMaterial(mat: THREE.Material): mat is SkinnableMaterial {
  return 'skinning' in (mat as SkinnableMaterial);
}

function isTintableMesh(obj: THREE.Object3D): obj is THREE.Mesh | THREE.SkinnedMesh {
  if (!isMeshLike(obj)) return false;
  if (!obj.material) return false;
  return true;
}

function applySkinnedMeshFlags(mat: THREE.Material) {
  if (!isSkinnableMaterial(mat)) return;
  mat.skinning = true;
}

function tryTintMaterial(mat: THREE.Material, tint: THREE.Color, match: (name: string) => boolean) {
  if (!match(mat.name ?? '')) return;
  if (!materialHasColor(mat)) return;

  mat.color.set(tint);
  mat.needsUpdate = true;
}

function cloneMaterialCached(src: THREE.Material, cache: Map<THREE.Material, THREE.Material>) {
  const cached = cache.get(src);
  if (cached) return cached;

  const cloned = src.clone();
  cache.set(src, cloned);
  return cloned;
}

function cloneAndTintMaterial(
  src: THREE.Material,
  tint: THREE.Color,
  cache: Map<THREE.Material, THREE.Material>,
  match: (name: string) => boolean,
): THREE.Material {
  const m = cloneMaterialCached(src, cache);

  applySkinnedMeshFlags(m);
  tryTintMaterial(m, tint, match);

  return m;
}

export function useTintMainMaterials(
  root: THREE.Object3D,
  color: THREE.ColorRepresentation,
  opts?: {
    match?: (materialName: string) => boolean;
  },
) {
  useLayoutEffect(() => {
    if (!root) return;

    const cache = new Map<THREE.Material, THREE.Material>();
    const tint = new THREE.Color(color);

    const match = opts?.match ?? ((name: string) => name === 'Main' || name.includes('Main'));

    root.traverse((obj) => {
      if (!isTintableMesh(obj)) return;

      const original = obj.material;

      if (Array.isArray(original)) {
        obj.material = original.map((mat) => cloneAndTintMaterial(mat, tint, cache, match));
        return;
      }

      obj.material = cloneAndTintMaterial(original, tint, cache, match);
    });
  }, [root, color, opts]);
}
