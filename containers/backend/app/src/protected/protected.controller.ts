import type { Request, Response } from "express";

import type { UserPublicResponse } from "@contracts/users/users.contracts";
import { findUserById } from "@/users/users.service";

export async function getMeProfile(
  req: Request,
  res: Response<UserPublicResponse>,
): Promise<void> {
  if (!req.session.userId) {
    res.status(401).json({
      ok: false,
      error: {
        code: "VALIDATION_ERROR",
        details: undefined,
      },
    });
    return;
  }
  const me = await findUserById(req.session.userId);
  res.status(200).json({
    ok: true,
    data: me,
  });
}
