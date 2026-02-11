import { socket } from '@/lib/sockets';

export function FloorClickToMove({
  mapSize = 10,
  cellSize = 1,
}: {
  mapSize?: number;
  cellSize?: number;
}) {
  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, 0, 0]}
      onPointerDown={(e) => {
        e.stopPropagation();

        const p = e.point;
        const half = mapSize / 2;
        const clampedX = Math.max(-half, Math.min(half, p.x));
        const clampedZ = Math.max(-half, Math.min(half, p.z));

        const snappedX = Math.round(clampedX / cellSize) * cellSize;
        const snappedZ = Math.round(clampedZ / cellSize) * cellSize;

        socket.emit('moveTo', [snappedX, 0, snappedZ]);
      }}
    >
      <planeGeometry args={[mapSize, mapSize]} />
      <meshStandardMaterial transparent opacity={0} />
    </mesh>
  );
}
