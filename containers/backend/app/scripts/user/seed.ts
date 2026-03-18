import { Pool } from "pg";
import { faker } from "@faker-js/faker";
import { createHash } from "crypto";

const sql = String.raw;

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

async function insertSeedUser(pool: Pool): Promise<boolean> {
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

async function insertSpecificUser(pool: Pool, user: string) {
  await pool.query(
    sql`
    INSERT INTO public.users (
      email,
      username,
      password_hash)
    VALUES ('${user}@fakemail.com', '${user}', 'contraseña')
    ON CONFLICT (email) DO NOTHING`,
  );
}

export async function seed() {
  console.log(`Seeding Database`);
  // if (process.env.NODE_ENV !== "development") {
  //   throw new Error("Seeding is only allowed in development.");
  // }

  const pool = new Pool();

  const requested = Number(process.argv[2] ?? 10);
  const safeCount = Math.min(Math.max(requested, 1), 500);

  let inserted = 0;
  let attempts = 0;

  await insertSpecificUser(pool, "ziermax");
  await insertSpecificUser(pool, "fernan");
  // Retry loop to deal with rare email/username collisions
  while (inserted < safeCount && attempts < safeCount * 5) {
    attempts++;
    if (await insertSeedUser(pool)) inserted++;
  }

  console.log({ requested: safeCount, inserted, attempts });
  await pool.end();
  console.log(`Seeded`);
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
