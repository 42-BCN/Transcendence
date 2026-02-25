import type { UserPublic } from "../contracts/api/users/users.contracts";
import { pool } from "../shared/db.pool";

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
function mapUserRow(row: Pick<UserRow, "id" | "username">): UserPublic {
  return {
    id: row.id,
    username: row.username,
  };
}

/**
 * List users (safe columns only)
 */
export async function listUsers(
  limit: number,
  offset: number,
): Promise<UserPublic[]> {
  const res = await pool.query<Pick<UserRow, "id" | "username">>(
    `
    SELECT id, username
    FROM public.users
    ORDER BY created_at DESC
    LIMIT $1 OFFSET $2;
    `,
    [limit, offset],
  );
  return res.rows.map(mapUserRow);
}
