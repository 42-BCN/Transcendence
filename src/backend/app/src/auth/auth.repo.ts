import { pool } from "../shared/db.pool";
import { sql } from "../shared/sql";
import type { AuthUserRow } from "./auth.model";

type UserPublic = Pick<AuthUserRow, "id" | "email" | "username">;
type UserWithPassword = Pick<
  AuthUserRow,
  "id" | "email" | "username" | "password_hash"
>;

const USER_PUBLIC_SELECT = `id, email, username`;
const USER_WITH_PASSWORD_SELECT = `id, email, username, password_hash`;

export async function findUserByEmail(
  email: string,
): Promise<AuthUserRow | null> {
  const res = await pool.query<AuthUserRow>(
    sql`
    SELECT id, email, username, password_hash
    FROM public.users
    WHERE email = $1
    LIMIT 1;
    `,
    [email],
  );
  return res.rows[0] ?? null;
}

export async function findUserByUsername(
  username: string,
): Promise<UserWithPassword | null> {
  const res = await pool.query<UserWithPassword>(
    sql`
    SELECT ${USER_WITH_PASSWORD_SELECT}
    FROM public.users
    WHERE username = $1
    LIMIT 1;
    `,
    [username],
  );
  return res.rows[0] ?? null;
}

export async function findUserById(id: string): Promise<UserPublic | null> {
  const res = await pool.query<UserPublic>(
    sql`
    SELECT ${USER_PUBLIC_SELECT}
    FROM public.users
    WHERE id = $1
    LIMIT 1;
    `,
    [id],
  );
  return res.rows[0] ?? null;
}

export async function findUserByGoogleId(
  googleId: string,
): Promise<UserPublic | null> {
  const res = await pool.query<UserPublic>(
    sql`
    SELECT ${USER_PUBLIC_SELECT}
    FROM public.users
    WHERE google_id = $1
    LIMIT 1;
    `,
    [googleId],
  );

  return res.rows[0] ?? null;
}

export async function insertGoogleUser(input: {
  email: string;
  googleId: string;
  username: string;
}): Promise<UserPublic> {
  const res = await pool.query<UserPublic>(
    sql`
    INSERT INTO public.users (email, username, google_id)
    VALUES ($1, $2, $3)
    RETURNING ${USER_PUBLIC_SELECT};
    `,
    [input.email, input.username, input.googleId],
  );

  const row = res.rows[0];
  if (!row) throw new Error("insertGoogleUser: no row returned");
  return row;
}

export async function insertUser(input: {
  email: string;
  username: string;
  passwordHash: string;
}): Promise<UserPublic | null> {
  const res = await pool.query<UserPublic>(
    sql`
    INSERT INTO public.users (email, username, password_hash)
    VALUES ($1, $2, $3)
    ON conflict do nothing
    RETURNING ${USER_PUBLIC_SELECT};
    `,
    [input.email, input.username, input.passwordHash],
  );
  return res.rows[0] ?? null;
}

export async function linkGoogleIdToEmailUser(input: {
  email: string;
  googleId: string;
}): Promise<UserPublic> {
  const res = await pool.query<UserPublic>(
    sql`
    UPDATE public.users
    SET google_id = $1
    WHERE email = $2
    RETURNING ${USER_PUBLIC_SELECT};
    `,
    [input.googleId, input.email],
  );

  const row = res.rows[0];
  if (!row) throw new Error("linkGoogleIdToEmailUser: no row returned");
  return row;
}
