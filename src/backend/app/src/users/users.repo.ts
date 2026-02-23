import { pool } from "../shared/db.pool";
import type { User } from "./users.model";

type UserRow = {
  id: string;
  email: string;
  created_at: Date;
};

function mapUserRow(row: UserRow): User {
  return {
    id: row.id,
    email: row.email,
    createdAt: row.created_at,
  };
}

export async function insertUser(input: {
  email: string;
  passwordHash: string;
}): Promise<User | null> {
  const res = await pool.query<UserRow>(
    `
    insert into public.users (email, password_hash)
    values ($1, $2)
    on conflict do nothing
    returning id, email, created_at;
    `,
    [input.email, input.passwordHash],
  );

  if (!res.rows[0]) return null;

  return mapUserRow(res.rows[0]);
}

export async function listUsers(
  limit: number,
  offset: number,
): Promise<User[]> {
  const res = await pool.query<UserRow>(
    `
    select id, email, created_at
    from public.users
    order by created_at desc
    limit $1 offset $2;
    `,
    [limit, offset],
  );

  return res.rows.map(mapUserRow);
}
