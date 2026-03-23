import { Pool } from "pg";

import { bootstrap } from "./bootstrap";

const sql = String.raw;

export async function reset(): Promise<void> {
  //Delete
  console.log(`Resetting Database`);
  if (process.env.NODE_ENV !== "development") {
    throw new Error("Resetting is only allowed in development.");
  }
  const pool = new Pool();
  try {
    await pool.query(sql`DROP TABLE IF EXISTS public.users`);
  } catch (err) {
    await pool.end();
    throw err;
  }
  await pool.end();
  //Bootstrap
  await bootstrap();
  console.log(`Reset`);
}
