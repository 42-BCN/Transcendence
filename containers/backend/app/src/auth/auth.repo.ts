import { pool, sql, ApiError } from "@shared";

import type { AuthUserRow } from "./auth.model";

type UserPublic = Pick<AuthUserRow, "id" | "email" | "username">;
type UserWithPassword = Pick<
  AuthUserRow,
  "id" | "email" | "username" | "password_hash"
>;

//Easy solution (export) for the Service
export type UserRecoverData = Pick<
  AuthUserRow,
  | "id"
  | "email"
  | "username"
  | "is_blocked"
  | "recover_token"
  | "recover_token_expiration"
  | "recover_attempts"
>;

const USER_PUBLIC_SELECT = `id, email, username`;
const USER_WITH_PASSWORD_SELECT = `id, email, username, password_hash`;
const USER_RECOVER_DATA = `id, email, username, is_blocked, recover_token, recover_token_expiration, recover_attempts`;

export async function findUserByEmail(
  email: string,
): Promise<UserWithPassword | null> {
  const res = await pool.query<UserWithPassword>(
    //Cambiar Query.select.values a una MACRO
    sql`
    SELECT ${USER_WITH_PASSWORD_SELECT}
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
    INSERT INTO public.users (email, username, google_id, provider)
    VALUES ($1, $2, $3, $4)
    RETURNING ${USER_PUBLIC_SELECT};
    `,
    [input.email, input.username, input.googleId, "google"],
  );

  const row = res.rows[0];
  if (!row) throw new ApiError("AUTH_GOOGLE_USER_INSERT_FAILED");
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
    ON CONFLICT DO NOTHING
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
  if (!row) throw new ApiError("AUTH_GOOGLE_LINK_FAILED");
  return row;
}

/*
 * RECOVERY PROCESS
 *  */
export async function findUserForRecovery(
  key: "email" | "username",
  identifier: string,
): Promise<UserRecoverData | null> {
  const res = await pool.query(
    sql`
    SELECT ${USER_RECOVER_DATA} FROM public.users 
    WHERE ${key} = $1;
  `,
    [identifier],
  );
  return res.rows[0] || null;
}
export async function setRecoveryToken(
  username: string,
  token: string,
): Promise<void> {
  await pool.query(
    sql`
    UPDATE public.users 
    SET 
      updated_at = NOW(),
      recover_token = $2, 
      recover_token_expiration = NOW() + INTERVAL '5 minutes',
      recover_attempts = recover_attempts + 1
    WHERE id = $1;
  `,
    [username, token],
  );
}
export async function findUserByToken(
  token: string,
): Promise<UserRecoverData | null> {
  const res = await pool.query(
    sql`SELECT ${USER_RECOVER_DATA} FROM public.users
    WHERE recover_token = $1/* AND recover_token_expiration > NOW()*/`,
    [token],
  );
  return res.rows[0];
}
export async function updatePasswordRecover(
  userId: string,
  password: string,
): Promise<void> {
  await pool.query(
    sql`
    UPDATE public.users 
    SET
      updated_at = NOW(),
      password_hash = $2,
      recover_token = NULL,
      recover_token_expiration = NULL,
      recover_attempts = 0
    WHERE id = $1`,
    [userId, password],
  );
}
export async function resetRecover(userId: string): Promise<void> {
  await pool.query(
    sql`UPDATE public.users
    SET
      updated_at = NOW(),
      recover_token = NULL,
      recover_token_expiration = NULL,
      recover_attempts = 0
    WHERE id = $1`,
    [userId],
  );
}

export async function selectUser(
  username: string,
): Promise<AuthUserRow | null> {
  const res = await pool.query<AuthUserRow>(
    `SELECT * FROM public.users WHERE username = $1`,
    [username],
  );
  return res.rows[0] || null;
}
