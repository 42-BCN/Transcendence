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
