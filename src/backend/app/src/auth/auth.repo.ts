import { pool } from "../shared/db.pool";

export type AuthUserRow = {
  id: string;
  email: string;
  username: string;
  password_hash: string;
};

export async function findUserByEmail(
  email: string,
): Promise<AuthUserRow | null> {
  const res = await pool.query<AuthUserRow>(
    `
    select id, email, username, password_hash
    from public.users
    where email = $1
    limit 1;
    `,
    [email],
  );
  return res.rows[0] ?? null;
}

export async function findUserByUsername(
  username: string,
): Promise<AuthUserRow | null> {
  const res = await pool.query<AuthUserRow>(
    `
    select id, email, username, password_hash
    from public.users
    where username = $1
    limit 1;
    `,
    [username],
  );
  return res.rows[0] ?? null;
}

export async function findUserById(
  id: string,
): Promise<Pick<AuthUserRow, "id" | "email" | "username"> | null> {
  const res = await pool.query<Pick<AuthUserRow, "id" | "email" | "username">>(
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

export async function insertUser(input: {
  email: string;
  username: string;
  passwordHash: string;
}): Promise<Pick<AuthUserRow, "id" | "email" | "username"> | null> {
  const res = await pool.query<Pick<AuthUserRow, "id" | "email" | "username">>(
    `
    insert into public.users (email, username, password_hash)
    values ($1, $2, $3)
    on conflict do nothing
    returning id, email, username;
    `,
    [input.email, input.username, input.passwordHash],
  );
  return res.rows[0] ?? null;
}
