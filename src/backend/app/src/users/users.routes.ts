import { Router } from "express";

import { validateQuery, validateParams } from "../shared/validation";
import { getUsersController, getUserById } from "./users.controllers";
import {
  GetUserByIdParamSchema,
  GetUsersQuerySchema,
} from "../contracts/api/users/users.validation";

export const usersRouter = Router();

// ---------------------------------------
// GET /api/users?limit=20&offset=0
// ---------------------------------------
usersRouter.get("/", validateQuery(GetUsersQuerySchema), getUsersController);
usersRouter.get(
  "/:userId",
  validateParams(GetUserByIdParamSchema),
  getUserById,
);
