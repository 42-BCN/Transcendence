import type { Request, Response } from "express";

import { UsersListQuerySchema } from "@/contracts/api/users/users.validation";
import type { UsersListResponse } from "@/contracts/api/users/users.endpoints";
import { VALIDATION } from "@/contracts/api/http/validation";
import { toValidationDetails } from "../shared/validation";
import { getUsers } from "./users.service";

export async function getUsersController(
  req: Request,
  res: Response,
): Promise<void> {
  const parsed = UsersListQuerySchema.safeParse(req.query);

  if (!parsed.success) {
    const body: UsersListResponse = {
      ok: false,
      error: {
        code: VALIDATION.REQUIRED, // replace with USERS_ERRORS.VALIDATION_ERROR if you have one
        details: toValidationDetails(parsed.error),
      },
    };

    res.status(422).json(body);
    return;
  }

  try {
    const { limit, offset } = parsed.data;

    const users = await getUsers({ limit, offset });

    const body: UsersListResponse = {
      ok: true,
      data: {
        users,
        page: {
          limit: limit ?? 20,
          offset: offset ?? 0,
          count: users.length,
        },
      },
    };

    res.status(200).json(body);
  } catch {
    const body: UsersListResponse = {
      ok: false,
      error: {
        code: "INTERNAL_ERROR",
      },
    };

    res.status(500).json(body);
  }
}