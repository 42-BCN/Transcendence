import { Pool } from "pg";

const sql = String.raw;

export async function bootstrap(): Promise<void> {
  console.log(`Bootstrapping Database`);
  const pool = new Pool();
  try {
    await pool.query(sql`CREATE extension IF NOT EXISTS "pgcrypto";`);

    await pool.query(sql`
      CREATE TABLE IF NOT EXISTS public.users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

      email TEXT NOT NULL UNIQUE,
      username TEXT NOT NULL UNIQUE,

      password_hash TEXT,

      google_id TEXT UNIQUE,
      provider TEXT NOT NULL DEFAULT 'local',

      is_blocked BOOLEAN NOT NULL DEFAULT FALSE,
      email_verified_at TIMESTAMPTZ,

      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

      CONSTRAINT users_auth_provider_chk
        CHECK (provider IN ('local', 'google'))
      );
  `);

    // These are redundant if you already have UNIQUE constraints,
    // but explicit indexes are fine and idempotent.
    await pool.query(
      sql`CREATE unique index if not exists users_email_uidx on public.users (email);`,
    );
    await pool.query(
      sql`CREATE unique index if not exists users_username_uidx on public.users (username);`,
    );
    await pool.query(
      sql`CREATE unique index if not exists users_google_id_uidx on public.users (google_id);`,
    );
  } catch (err) {
    await pool.end();
    throw err;
  }
  await pool.end();
  console.log(`Bootstrapped`);
}
