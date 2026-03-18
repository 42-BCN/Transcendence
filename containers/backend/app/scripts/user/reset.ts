import { Pool } from "pg";

import { bootstrap } from "./bootstrap";

const sql = String.raw;

export async function reset(): Promise<void> {
  //Delete
  console.log(`Resetting Database`);
  const pool = new Pool();
  await pool.query(sql`DROP TABLE IF EXISTS public.users`);
  await pool.end();
  //Bootstrap
  await bootstrap();
  console.log(`Reset`);
}
