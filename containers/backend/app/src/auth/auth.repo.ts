import { pool, sql, ApiError } from "@shared";
import { prisma } from "@/lib/prisma";

import type { AuthUserRow } from "./auth.model";

type UserPublic = Pick<AuthUserRow, "id" | "email" | "username">;
type UserWithPassword = Pick<
  AuthUserRow,
  "id" | "email" | "username" | "password_hash"
>;

const USER_PUBLIC_SELECT = `id, email, username`;

const userPublicSelect = {
  id: true,
  email: true,
  username: true,
} as const;

const userWithPasswordSelect = {
  id: true,
  email: true,
  username: true,
  password_hash: true,
} as const;

export function findUserByEmail(
  email: string,
): Promise<UserWithPassword | null> {
  return prisma.user.findUnique({
    where: { email },
    select: userWithPasswordSelect,
  });
}

export function findUserByUsername(
  username: string,
): Promise<UserWithPassword | null> {
  return prisma.user.findUnique({
    where: { username },
    select: userWithPasswordSelect,
  });
}

export function findUserById(id: string): Promise<UserPublic | null> {
  return prisma.user.findUnique({
    where: { id },
    select: userPublicSelect,
  });
}

export function findUserByGoogleId(
  googleId: string,
): Promise<UserPublic | null> {
  return prisma.user.findUnique({
    where: { google_id: googleId },
    select: userPublicSelect,
  });
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
