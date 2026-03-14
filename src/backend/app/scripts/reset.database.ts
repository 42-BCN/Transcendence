import { pool } from "../src/shared/db.pool";
import { bootstrap } from "./bootstrap.ts";

async function resetDatabase(): Promise<void> {
  await pool.query(`DROP TABLE IF EXISTS users`);
}

console.log(`Reseting Database`);
await resetDatabase();
await bootstrap();
console.log(`Reseted`);
