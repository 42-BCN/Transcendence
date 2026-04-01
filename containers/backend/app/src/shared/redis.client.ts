import { createClient } from "redis";

const redisUrl = process.env.REDIS_URL;

if (!redisUrl) {
  throw new Error("REDIS_URL is required");
}

export const redisClient = createClient({
  url: redisUrl,
});

redisClient.on("error", (err: unknown) => {
  console.error("Redis error:", err);
});

export async function connectRedis(): Promise<void> {
  if (redisClient.isOpen) {
    return;
  }

  await redisClient.connect();
  console.log("Redis connected");
}
