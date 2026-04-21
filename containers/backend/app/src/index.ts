import app from './app';
import { connectRedis } from './shared/redis.client';
import { existsSync, readFileSync } from 'fs';
import { createServer as createHttpsServer } from 'https';
import { join } from 'path';

const PORT = Number(process.env.PORT ?? 4000);
const CERT_DIR = process.env.CERT_DIR;

function listen(port: number): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!CERT_DIR) {
      throw new Error('CERT_DIR is required');
    }

    const certPath = join(CERT_DIR, 'localhost.crt');
    const keyPath = join(CERT_DIR, 'localhost.key');

    if (!existsSync(certPath) || !existsSync(keyPath)) {
      throw new Error(`TLS certs not found in ${CERT_DIR}`);
    }

    const server = createHttpsServer(
      {
        cert: readFileSync(certPath),
        key: readFileSync(keyPath),
      },
      app,
    );

    server.listen(port, () => {
      console.log(`Server running on port ${port} over HTTPS`);
      resolve();
    });

    server.on('error', reject);
  });
}

async function start(): Promise<void> {
  await connectRedis();
  await listen(PORT);
}

void start().catch((err: unknown) => {
  console.error('Startup failed:', err);
  process.exitCode = 1;
});
