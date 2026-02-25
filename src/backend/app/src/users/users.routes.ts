import { Router } from "express";

import { validateQuery } from "../shared/validation";
import { getUsersController } from "./users.controllers";
import { GetUsersQuerySchema } from "../contracts/api/users/users.validation";

export const usersRouter = Router();

// ---------------------------------------
// GET /api/users?limit=20&offset=0
// ---------------------------------------
usersRouter.get("/", validateQuery(GetUsersQuerySchema), getUsersController);
