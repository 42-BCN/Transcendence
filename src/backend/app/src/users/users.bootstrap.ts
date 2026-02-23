import { faker } from "@faker-js/faker";

import { pool } from "../shared/db.pool";

async function tableExists(): Promise<boolean> {
  const res = await pool.query<{ exists: boolean }>(`
    select exists (
      select 1
      from information_schema.tables
      where table_schema = 'public'
      and table_name = 'users'
    ) as "exists";
  `);

  return res.rows[0]?.exists === true;
}

async function countUsers(): Promise<number> {
  const res = await pool.query<{ count: string }>(
    `select count(*)::text as count from public.users;`,
  );

  return Number(res.rows[0]?.count ?? 0);
}

async function ensureUsersTable(): Promise<void> {
  await pool.query(`create extension if not exists "pgcrypto";`);

  // Create table if it does not exist (fresh DB)
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

  // If table existed previously, add missing columns safely
  await pool.query(`
    alter table public.users
      add column if not exists username text,
      add column if not exists password_hash text;
  `);

  // Backfill username for existing rows (if any were created before username existed)
  await pool.query(`
    update public.users
    set username = concat('user_', left(replace(id::text, '-', ''), 12))
    where username is null;
  `);

  // Backfill password_hash if somehow missing
  await pool.query(`
    update public.users
    set password_hash = concat('dev_seed_', left(replace(gen_random_uuid()::text, '-', ''), 24))
    where password_hash is null;
  `);

  // Enforce constraints after backfill
  await pool.query(`
    alter table public.users
      alter column username set not null,
      alter column password_hash set not null;
  `);

  // Ensure uniqueness (if table existed without these constraints)
  await pool.query(`create unique index if not exists users_email_uidx on public.users (email);`);
  await pool.query(`create unique index if not exists users_username_uidx on public.users (username);`);
}

function makeUsername(): string {
  // Reduce collisions: sanitize + suffix
  const base = faker.internet
    .username()
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, "_")
    .slice(0, 20);

  const suffix = faker.string.alphanumeric(6).toLowerCase();
  return `${base}_${suffix}`;
}

async function seedUsers(count: number): Promise<void> {
  for (let i = 0; i < count; i++) {
    const email = faker.internet.email().toLowerCase();
    const username = makeUsername();
    const passwordHash = `dev_seed_${faker.string.alphanumeric(24)}`;

    await pool.query(
      `
      insert into public.users (email, username, password_hash)
      values ($1, $2, $3)
      on conflict do nothing;
      `,
      [email, username, passwordHash],
    );
  }
}

export async function bootstrapUsers(): Promise<void> {
  const exists = await tableExists();

  if (!exists) {
    console.log("Creating users table...");
  } else {
    console.log("Users table exists, ensuring schema...");
  }

  await ensureUsersTable();

  const count = await countUsers();

  if (count === 0) {
    console.log("Seeding users...");
    await seedUsers(20);
  }

  console.log("Users bootstrap complete ✅");
}