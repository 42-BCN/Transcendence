import { Router } from "express";

import { validateQuery } from "../shared/validation";
import { getUsers } from "./users.service";
import { GetUsersQuerySchema } from "../contracts/api/users/users.validation";

export const usersRouter = Router();

/**
 * GET /users?limit=20&offset=0
 */
usersRouter.get("/users", validateQuery(GetUsersQuerySchema), getUsers);
