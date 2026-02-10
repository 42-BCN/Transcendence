import { createServer } from 'http';
import { Server } from 'socket.io';

const httpServer = createServer();

const io = new Server(httpServer, {
  cors: { origin: '*' },
});

type Vec3 = [number, number, number];

type Character = {
  
  id: string;
  position: Vec3;
  target?: Vec3;
  color: string;
};

const MAP_SIZE = 10; // must match <Grid args={[10,10]} />
const CELL_SIZE = 1; // set to 0 to disable snapping

const half = MAP_SIZE / 2;

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));
const snap = (v: number, step: number) => (step > 0 ? Math.round(v / step) * step : v);

const generateRandomPosition = (): Vec3 => {
  const x = (Math.random() - 0.5) * MAP_SIZE;
  const z = (Math.random() - 0.5) * MAP_SIZE;
  return [snap(x, CELL_SIZE), 0, snap(z, CELL_SIZE)];
};

const generateRandomHexColor = () =>
  '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');

const characters: Character[] = [];

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  characters.push({
    id: socket.id,
    position: generateRandomPosition(),
    color: generateRandomHexColor(),
  });

  io.emit('characters', characters);

  // ✅ click-to-move updates come here
  socket.on('moveTo', (target: Vec3) => {
    const c = characters.find((x) => x.id === socket.id);
    if (!c) return;

    // Optional: snap + clamp before saving
    const [x, y, z] = target;
    c.target = [clamp(snap(x, CELL_SIZE), -half, half), y, clamp(snap(z, CELL_SIZE), -half, half)];

    io.emit('characters', characters);
    c.position = [... c.target];
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);

    const idx = characters.findIndex((c) => c.id === socket.id);
    if (idx !== -1) characters.splice(idx, 1);

    io.emit('characters', characters);
  });
});

httpServer.listen(3100, () => {
  console.log('Socket.IO server running on :3100');
});