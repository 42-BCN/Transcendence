// src/lib/prisma.ts
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

import { PrismaClient } from '../generated/prisma/client';

const { PGUSER, PGPASSWORD, PGDATABASE, PGHOST } = process.env;

if (!PGUSER || !PGPASSWORD || !PGDATABASE || !PGHOST) {
  throw new Error('Missing required PG* environment variables for Prisma runtime.');
}

const connectionString = `postgresql://${PGUSER}:${PGPASSWORD}@${PGHOST}:5432/${PGDATABASE}?schema=public`;

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
