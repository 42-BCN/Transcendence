import { faker } from "@faker-js/faker";
import { v4 as uuid } from "uuid";

import { insertUser } from "./users.repo";
import { pool } from "../shared/db.pool";

async function main() {
  if (process.env.NODE_ENV !== "development") {
    throw new Error("Seeding is only allowed in development.");
  }

  const count = Number(process.argv[2] ?? 20);
  const safeCount = Math.min(Math.max(count, 1), 500);

  let inserted = 0;

  for (let i = 0; i < safeCount; i++) {
    const created = await insertUser({
      id: uuid(),
      email: faker.internet.email().toLowerCase(),
      username: faker.internet.username().toLowerCase(),
    });

    if (created) inserted++;
  }

  console.log({ requested: safeCount, inserted });
  await pool.end();
}

main().catch((err) => {
  console.error(err);
  // process.exit(1);
});
