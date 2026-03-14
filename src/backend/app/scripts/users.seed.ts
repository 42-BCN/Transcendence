import { faker } from "@faker-js/faker";
import { createHash } from "crypto";
import { pool, sql } from "@shared";

import { bootstrapUsers } from "./users.bootstrap";

function makeUsername(): string {
  const base = faker.internet
    .username()
    .toLowerCase()
    .replace(/[^\d_a-z]/g, "_")
    .slice(0, 20);

  const suffix = faker.string.alphanumeric(8).toLowerCase();
  return `${base}_${suffix}`;
}

function makeDevPasswordHash(plain: string): string {
  // Cheap + dependency-free placeholder for dev seeds.
  // Replace later with bcrypt/argon2 in your auth module.
  return createHash("sha256").update(plain).digest("hex");
}

async function insertSeedUser(): Promise<boolean> {
  //Special ziermax user
  await pool.query(
    sql`
    INSERT INTO public.users (
      email,
      username,
      password_hash)
    VALUES ('ziermax@fakemail.com', 'ziermax', 'contraseña')
    ON CONFLICT (email) DO NOTHING`,
  );

  const email = faker.internet.email().toLowerCase();
  const username = makeUsername();

  const plainPassword = "Password123!";
  const passwordHash = makeDevPasswordHash(plainPassword);

  const res = await pool.query(
    sql`
    INSERT INTO public.users (
      email,
      username,
      password_hash,
      provider,
      email_verified_at,
      is_blocked
    )
    VALUES ($1, $2, $3, $4, $5, $6)
    ON CONFLICT DO NOTHING
    RETURNING id;
    `,
    [email, username, passwordHash, "local", new Date(), false],
  );

  return res.rowCount === 1;
}

export async function seed() {
  // if (process.env.NODE_ENV !== "development") {
  //   throw new Error("Seeding is only allowed in development.");
  // }

  const requested = Number(process.argv[2] ?? 10);
  const safeCount = Math.min(Math.max(requested, 1), 500);

  await bootstrapUsers();

  let inserted = 0;
  let attempts = 0;

  // Retry loop to deal with rare email/username collisions
  while (inserted < safeCount && attempts < safeCount * 5) {
    attempts++;
    if (await insertSeedUser()) inserted++;
  }

  console.log({ requested: safeCount, inserted, attempts });
}

// eslint-disable-next-line promise/catch-or-return
// main()
//   .catch((err) => {
//     console.error(err);
//     // process.exit(1);
//   })
//   .finally(async () => {
//     await pool.end();
//   });
