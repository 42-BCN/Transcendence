import type { Namespace, Socket } from 'socket.io';

type Vec3 = [number, number, number];

type Robot = {
  id: string;
  position: Vec3;
  target?: Vec3;
  color: string;
};

const MAP_SIZE = 10;
const CELL_SIZE = 1;
const half = MAP_SIZE / 2;

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

const snap = (v: number, step: number) => (step > 0 ? Math.round(v / step) * step : v);

const generateRandomPosition = (): Vec3 => {
  const x = (Math.random() - 0.5) * MAP_SIZE;
  const z = (Math.random() - 0.5) * MAP_SIZE;
  return [snap(x, CELL_SIZE), 0, snap(z, CELL_SIZE)];
};

const generateRandomHexColor = () =>
  `#${Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, '0')}`;

const robots: Robot[] = [];

export function registerRobotsSocket(nsp: Namespace) {
  nsp.on('connection', (socket: Socket) => {
    console.log('[robots] Client connected:', socket.id);

    robots.push({
      id: socket.id,
      position: generateRandomPosition(),
      color: generateRandomHexColor(),
    });

    nsp.emit('robots', robots);

    socket.on('moveTo', (target: Vec3) => {
      const r = robots.find((x) => x.id === socket.id);
      if (!r) return;

      const [x, y, z] = target;

      r.target = [
        clamp(snap(x, CELL_SIZE), -half, half),
        y,
        clamp(snap(z, CELL_SIZE), -half, half),
      ];

      nsp.emit('robots', robots);

      if (r.target) {
        r.position = [...r.target];
      }
    });

    socket.on('disconnect', () => {
      console.log('[robots] Client disconnected:', socket.id);

      const idx = robots.findIndex((r) => r.id === socket.id);
      if (idx !== -1) robots.splice(idx, 1);

      nsp.emit('robots', robots);
    });
  });
}
