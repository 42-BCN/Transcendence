import { createClient, type RedisClientType } from 'redis';

let redisClient: RedisClientType | null = null;

function getRedisUrl(): string {
  if (process.env.REDIS_URL) {
    return process.env.REDIS_URL;
  }

  const host = process.env.REDIS_HOST;
  const port = process.env.REDIS_PORT;

  if (!host || !port) {
    throw new Error('REDIS_URL or REDIS_HOST/REDIS_PORT is required');
  }

  return `redis://${host}:${port}`;
}

export function getRedisClient(): RedisClientType {
  if (!redisClient) {
    redisClient = createClient({
      url: getRedisUrl(),
    });

    redisClient.on('error', (err: unknown) => {
      console.error('Redis error:', err);
    });
  }

  return redisClient;
}

export async function connectRedis(): Promise<RedisClientType> {
  const client = getRedisClient();

  if (!client.isOpen) {
    await client.connect();
    console.log('Redis connected');
  }

  return client;
}
