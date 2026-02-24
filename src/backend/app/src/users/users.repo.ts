import { pool } from "../shared/db.pool";
import type { User } from "./users.model";

/**
 * Raw DB shape (infrastructure only)
 */
type UserRow = {
  id: string;
  email: string;
  username: string;
  created_at: Date;
};

/**
 * Safe domain mapping
 */
function mapUserRow(
  row: Pick<UserRow, "id" | "email" | "username" | "created_at">,
): User {
  return {
    id: row.id,
    username: row.username,
  };
}

/**
 * Create user
 */
export async function insertUser(input: {
  email: string;
  username: string;
  passwordHash: string;
}): Promise<User | null> {
  const res = await pool.query<
    Pick<UserRow, "id" | "email" | "username" | "created_at">
  >(
    `
    insert into public.users (email, username, password_hash)
    values ($1, $2, $3)
    on conflict do nothing
    returning id, email, username, created_at;
    `,
    [input.email, input.username, input.passwordHash],
  );

  if (!res.rows[0]) return null;

  return mapUserRow(res.rows[0]);
}

/**
 * List users (safe columns only)
 */
export async function listUsers(
  limit: number,
  offset: number,
): Promise<User[]> {
  const res = await pool.query<
    Pick<UserRow, "id" | "email" | "username" | "created_at">
  >(
    `
    select id, email, username, created_at
    from public.users
    order by created_at desc
    limit $1 offset $2;
    `,
    [limit, offset],
  );

  return res.rows.map(mapUserRow);
}

/**
 * Internal use for auth only (includes password_hash)
 */
export async function findUserByEmail(email: string): Promise<UserRow | null> {
  const res = await pool.query<UserRow>(
    `
    select id, email, username, password_hash, created_at
    from public.users
    where email = $1
    limit 1;
    `,
    [email],
  );

  return res.rows[0] ?? null;
}

export async function findUserById(
  id: string,
): Promise<Pick<UserRow, "id" | "email" | "username"> | null> {
  const res = await pool.query<Pick<UserRow, "id" | "email" | "username">>(
    `
    select id, email, username
    from public.users
    where id = $1
    limit 1;
    `,
    [id],
  );

  return res.rows[0] ?? null;
}
