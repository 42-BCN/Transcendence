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

async function createUsersTable() {
  await pool.query(`create extension if not exists "pgcrypto";`);

  await pool.query(`
    create table if not exists public.users (
      id uuid primary key default gen_random_uuid(),
      email text not null unique,
      password_hash text not null,
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now()
    );
  `);
}

async function seedUsers(count: number) {
  for (let i = 0; i < count; i++) {
    await pool.query(
      `
      insert into public.users (email, password_hash)
      values ($1, $2)
      on conflict do nothing;
      `,
      [
        faker.internet.email().toLowerCase(),
        `dev_seed_${faker.string.alphanumeric(24)}`,
      ],
    );
  }
}

export async function bootstrapUsers() {
  //   if (process.env.NODE_ENV !== "development") {
  //     console.log("Skipping bootstrap (not development)");
  //     return;
  //   }

  const exists = await tableExists();

  if (!exists) {
    console.log("Creating users table...");
    await createUsersTable();
  }

  const count = await countUsers();

  if (count === 0) {
    console.log("Seeding users...");
    await seedUsers(20);
  }

  console.log("Users bootstrap complete ✅");
}
