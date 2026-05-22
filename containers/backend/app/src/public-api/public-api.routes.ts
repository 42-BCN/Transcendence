import { Router } from 'express';

import {
  GetUserByIdParamSchema,
  GetUsersQuerySchema,
  SearchUsersQuerySchema,
} from '@contracts/users/users.validation';
import { requireApiKey, validateParams, validateQuery } from '@shared';

import { getUserById, getUserByUsername, getUsersController } from '../users/users.controllers';
import {
  getPublicApiHealthController,
  getPublicUsersCountController,
  searchPublicUsersController,
} from './public-api.controller';
import { publicApiRateLimit, publicApiSearchRateLimit } from './public-api.rate-limit';

export const publicApiRouter = Router();

publicApiRouter.use(publicApiRateLimit, requireApiKey);

publicApiRouter.get('/health', getPublicApiHealthController);
publicApiRouter.get('/users', validateQuery(GetUsersQuerySchema), getUsersController);
publicApiRouter.get('/users/count', getPublicUsersCountController);
publicApiRouter.get(
  '/users/search',
  publicApiSearchRateLimit,
  validateQuery(SearchUsersQuerySchema),
  searchPublicUsersController,
);
publicApiRouter.get('/users/username/:username', getUserByUsername);
publicApiRouter.get('/users/:userId', validateParams(GetUserByIdParamSchema), getUserById);
