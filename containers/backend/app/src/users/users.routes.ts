import { Router } from 'express';

import { validateQuery, validateParams } from '@shared';
import { GetUserByIdParamSchema, GetUsersQuerySchema } from '@contracts/users/users.validation';

import { getUsersController, getUserById, getUserByUsername } from './users.controllers';

export const usersRouter = Router();

// ---------------------------------------
// GET /api/users?limit=20&offset=0
// ---------------------------------------
usersRouter.get('/', validateQuery(GetUsersQuerySchema), getUsersController);
usersRouter.get('/:userId', validateParams(GetUserByIdParamSchema), getUserById);
usersRouter.get('/username/:username', getUserByUsername);
