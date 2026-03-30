// prisma.config.ts
import "dotenv/config";
import { defineConfig } from "prisma/config";

const { PGUSER, PGPASSWORD, PGDATABASE, PGHOST } = process.env;

if (!PGUSER || !PGPASSWORD || !PGDATABASE || !PGHOST) {
  throw new Error("Missing required PG* environment variables for Prisma.");
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: `postgresql://${PGUSER}:${PGPASSWORD}@${PGHOST}:5432/${PGDATABASE}?schema=public`,
  },
});
