import { Router } from 'express';

import { validateQuery, validateParams, requireAuth, ApiError } from '@shared';
import { createRateLimit } from '@shared/rate-limit';
import { GetUserByIdParamSchema, GetUsersQuerySchema, SearchUsersQuerySchema } from '@contracts/users/users.validation';

import { getUsersController, getUserById, getUserByUsername, searchUsersController } from './users.controllers';

const searchRateLimit = createRateLimit({
  keyPrefix: 'rl:users:search',
  max: 10,
  windowMs: 10_000,
  extractRaw: (req) => req.session?.userId,
  onLimitExceeded: () => new ApiError('AUTH_RATE_LIMITED'),
});

export const usersRouter = Router();

// ---------------------------------------
// GET /api/users?limit=20&offset=0
// ---------------------------------------
usersRouter.get('/', validateQuery(GetUsersQuerySchema), getUsersController);
usersRouter.get('/search', requireAuth, searchRateLimit, validateQuery(SearchUsersQuerySchema), searchUsersController);
usersRouter.get('/username/:username', getUserByUsername);
usersRouter.get('/:userId', validateParams(GetUserByIdParamSchema), getUserById);
