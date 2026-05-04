import express from 'express';
import { existsSync, readFileSync } from 'fs';
import { createServer as createHttpsServer } from 'https';
import { join } from 'path';
import { Server } from 'socket.io';

import { handleInternalNotify, handlePresenceCheck } from './internal/notify.routes';
import { registerSockets } from './sockets/socket.register';
import { logEvents } from './socket.logs';

const app = express();
app.use(express.json());

const certDir = process.env.CERT_DIR;

function createAppServer() {
  if (!certDir) {
    throw new Error('CERT_DIR is required');
  }

  const certPath = join(certDir, 'localhost.crt');
  const keyPath = join(certDir, 'localhost.key');

  if (!existsSync(certPath) || !existsSync(keyPath)) {
    throw new Error(`TLS certs not found in ${certDir}`);
  }

  return createHttpsServer(
    {
      cert: readFileSync(certPath),
      key: readFileSync(keyPath),
    },
    app,
  );
}

const httpServer = createAppServer();

if (!process.env.SOCKET_INTERNAL_SECRET) {
  logEvents.warn({
    event: 'internal_secret_not_configured',
    message:
      'SOCKET_INTERNAL_SECRET is not set; internal notify routes will accept requests without authentication.',
  });
}

const allowedOrigins = (process.env.SOCKET_CORS_ORIGINS ?? '')
  .split(',')
  .map((origin: string) => origin.trim())
  .filter(Boolean);

const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});
registerSockets(io);

app.post('/internal/notify', handleInternalNotify);
app.post('/internal/presence', handlePresenceCheck);

httpServer.listen(3100, () => {
  console.log('Socket.IO server + internal notify on :3100 over HTTPS');
});
