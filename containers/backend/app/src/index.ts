import app from './app';
import { connectRedis } from './shared/redis.client';

const PORT = Number(process.env.PORT ?? 4000);

function listen(port: number): Promise<void> {
  return new Promise((resolve, reject) => {
    const server = app.listen(port, () => {
      console.log(`Server running on port ${port}`);
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
