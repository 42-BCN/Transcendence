import { Pool } from "pg";

import { bootstrap } from "./bootstrap";

export const sql = String.raw;

export async function reset(): Promise<void> {
  //Delete
  console.log(`Reseting Database`);
  const pool = new Pool();
  await pool.query(`DROP TABLE IF EXISTS users`);
  await pool.end();
  //Bootstrap
  await bootstrap();
  console.log(`Reseted`);
}
