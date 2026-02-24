import { pool } from "../shared/db.pool";

export async function bootstrapUsers(): Promise<void> {
  // Needed for gen_random_uuid()
  await pool.query(`create extension if not exists "pgcrypto";`);

  await pool.query(`
    create table if not exists public.users (
      id uuid primary key default gen_random_uuid(),
      email text not null unique,
      username text not null unique,
      password_hash text not null,
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now()
    );
  `);

  // These are redundant if you already have UNIQUE constraints,
  // but explicit indexes are fine and idempotent.
  await pool.query(
    `create unique index if not exists users_email_uidx on public.users (email);`,
  );
  await pool.query(
    `create unique index if not exists users_username_uidx on public.users (username);`,
  );
}
