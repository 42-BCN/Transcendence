import type { Request, Response } from "express";

import type { UserPublicResponse } from "@contracts/users/users.contracts";
import { findUserById } from "@/users/users.service";

export async function getMeProfile(
  req: Request,
  res: Response<UserPublicResponse>,
): Promise<void> {
  const userId = req.session.userId as string; // guaranteed by requireAuth
  const me = await findUserById(userId);
  res.status(200).json({
    ok: true,
    data: me,
  });
}
