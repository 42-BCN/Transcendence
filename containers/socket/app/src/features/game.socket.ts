import type { Namespace, Socket } from 'socket.io';

const playerIds: string[] = ['assassin', 'paladin', 'mage', 'alchemist'].reverse();
const users: Record<string, string> = {};
let numberOfRolls = 0;

export function registerGameSocket(
  nsp: Namespace<ClientToServerGameEvents, ServerToClientGameEvents>,
) {
  nsp.on('connection', (socket: Socket<ClientToServerGameEvents, ServerToClientGameEvents>) => {
    if (playerIds.length === 0) {
      console.log('Room full, spectator joined:', socket.id);
      return;
    }
    const assignedRole = playerIds.pop();
    if (!assignedRole) return;

    users[socket.id] = assignedRole;
    console.log(socket.id, 'joined with', users[socket.id]);
    socket.emit('game:server:rolls', numberOfRolls);

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
