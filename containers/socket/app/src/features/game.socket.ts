import type { Namespace, Socket } from 'socket.io';
import TinyQueue from "tinyqueue";
import type { ClientToServerGameEvents, ServerToClientGameEvents } from '../../../../contracts/sockets/game/game.schema';

const playerIds: string[] = ['assassin', 'paladin', 'mage', 'alchemist'].reverse();
const users: Record<string, string> = {};
let numberOfRolls = 0;

// function dijkstra(pos: pos, maxCost: number) => {
//   const state = get();
//   const initial = `${pos.x},${pos.y},${pos.z}`;
//   const MOV = [
//     [1, 0, 0], [-1, 0, 0],
//     [0, 0, 1], [0, 0, -1],
//     [1, 1, 0], [-1, 1, 0],
//     [0, 1, 1], [0, 1, -1],
//     [1, -1, 0], [-1, -1, 0],
//     [0, -1, 1], [0, -1, -1],
//   ];
//   const dist: Record<string, number> = { [initial]: 0 };
//   const nodes = new TinyQueue<{ key: string; d: number }>([], (a, b) => a.d - b.d);
//   nodes.push({ key: initial, d: 0 });
//   while (nodes.length > 0) {
//     const { key, d } = nodes.pop()!;
//     if (d > (dist[key] ?? Infinity))
//       continue;
//     if (d > maxCost)
//       break;
//     const [x, y, z] = key.split(",").map(Number);
//     for (const [dx, dy, dz] of MOV) {
//       const nx = x + dx;
//       const ny = y + dy;
//       const nz = z + dz;
//       if (state.isOOB(nx, ny, nz) || state.isBlocked(nx, ny, nz)
//         || !state.hasFloor(nx, ny, nz))
//         continue;
//       const stepCost = dy === 1 ? 2 : 1;
//       const newCost = d + stepCost;
//       const nkey = `${nx},${ny},${nz}`;
//       if (newCost < (dist[nkey] ?? Infinity)) {
//         dist[nkey] = newCost;
//         nodes.push({ key: nkey, d: newCost });
//       }
//     }
//   }
//   const reachable: string[] = [];
//   for (const key in dist) {
//     if (dist[key] <= maxCost && key !== initial) {
//       const [x, y, z] = key.split(",").map(Number);
//       reachable.push(`${x},${y - 1},${z}`);
//     }
//   }
//
//   return reachable;
// },

export function registerGameSocket(
  nsp: Namespace<ClientToServerGameEvents, ServerToClientGameEvents>,
) {
  nsp.on('connection', (socket: Socket<ClientToServerGameEvents, ServerToClientGameEvents>) => {
    if (playerIds.length === 0) {
      console.log('Room full, spectator joined:', socket.id);
      return;
    }
    const assignedRole = playerIds.pop();
    if (!assignedRole)
      return (console.log('Room full, spectator joined:', socket.id));
    users[socket.id] = assignedRole;
    console.log(socket.id, 'joined with', assignedRole, users[socket.id]);
    socket.emit('game:server:rolls', numberOfRolls);

    socket.on('game:client:displayMoveRange', (payload: number) => {
      console.log('Received move range event with dice:', payload,
        'for character', users[socket.id]);
      numberOfRolls += payload;
      nsp.emit('game:server:rolls', numberOfRolls);
      // highlights = ()
      // socket.emit('game:server:displayMoveRange', (payload: number) => {
      // console.log('game:server:displayMoveRange called'));
    });
    socket.on('game:client:rolls', (payload: number) => {
      console.log('Received roll dice event with quantity:', payload);
      numberOfRolls += payload;
      nsp.emit('game:server:rolls', numberOfRolls);
    });
    socket.on('disconnect', () => {
      const free = users[socket.id];
      if (free) {
        playerIds.push(free);
        delete users[socket.id];
        console.log(free, 'disconnected, role is available again.');
      }
    });
  });
}

// import { Astar } from '@/shared/gridMath';
//
// // "Base de datos" en memoria del servidor (En un juego real podría ser Redis)
// // Aquí guardamos dónde está cada jugador y los obstáculos del mapa
// const gameState = {
//   players: {}, // Rellenado al iniciar la partida
//   obstacles: {}, // Tu mapa
// };
//
// export function registerGameSocket(
//   nsp: Namespace<ClientToServerGameEvents, ServerToClientGameEvents>
// ) {
//   nsp.on('connection', (socket: Socket<ClientToServerGameEvents, ServerToClientGameEvents>) => {
//     console.log(`Jugador conectado al juego: ${socket.id}`);
//
//     // 1. Escuchamos la INTENCIÓN de movimiento del cliente
//     socket.on('game:client:move', (payload) => {
//       const { entityId, target } = payload;
//       const entity = gameState.players[entityId];
//
//       if (!entity) return; // La entidad no existe, ignorar.
//
//       // 2. EL SERVIDOR VALIDA (Autoridad)
//       // Usamos la MISMA función A* que usa el frontend para ver si hay un camino válido
//       const path = Astar(entity.position, target, gameState.obstacles);
//
//       // Si Astar devuelve vacío o indefinido, es un movimiento ilegal (trampas o lag)
//       if (!path || path.length === 0) {
//         console.log(`Movimiento ilegal detectado del socket ${socket.id}`);
//         // Opcional: Emitir un evento al jugador para forzarle a volver a su posición real
//         // socket.emit('game:server:sync', gameState);
//         return;
//       }
//
//       // 3. EL SERVIDOR APLICA EL CAMBIO
//       entity.position = target;
//       // Aquí también restarías los dados usados, cambiarías el turno, etc.
//
//       // 4. EL SERVIDOR AVISA A TODOS LOS JUGADORES
//       // Hacemos broadcast del nuevo estado (o solo del movimiento) para que todos lo vean
//       nsp.emit('game:server:sync', gameState);
//     });
//
//     // ... aquí irían tus otros eventos (tirar dados, usar habilidades, etc.)
//   });
// }
