import { createServer } from 'http';
import { Server } from 'socket.io';

import { registerSockets } from './sockets/socket.register';

const httpServer = createServer();

const io = new Server(httpServer, {
  cors: { origin: '*' },
});

registerSockets(io);

httpServer.listen(3100, () => {
  console.log('Socket.IO server running on :3100');
});
