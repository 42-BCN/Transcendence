import type { UserPublic } from "@contracts/users/users.contracts";
import { pool, sql } from "@shared";

// Raw DB shape (infrastructure only)
type UserRow = {
  id: string;
  email: string;
  username: string;
  created_at: Date;
};

// Safe domain mapping
function mapUserRow(row: Pick<UserRow, "id" | "username">): UserPublic {
  return {
    id: row.id,
    username: row.username,
  };
}

// List users (safe columns only)
export async function listUsers(
  limit: number,
  offset: number,
): Promise<UserPublic[]> {
  const res = await pool.query<Pick<UserRow, "id" | "username">>(
    sql`
    SELECT id, username
    FROM public.users
    ORDER BY created_at DESC
    LIMIT $1 OFFSET $2;
    `,
    [limit, offset],
  );
  return res.rows.map(mapUserRow);
}

export async function selectUserData(id: string): Promise<UserPublic | null> {
  const res = await pool.query(
    sql`
    SELECT id, username
    FROM public.users
    WHERE id = $1;`,
    [id],
  );
  return res.rows[0] ?? null;
}
