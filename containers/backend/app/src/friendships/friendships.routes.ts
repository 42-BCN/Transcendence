import type { RequestHandler } from 'express';
import { Router } from 'express';
import { validateBody, requireAuth } from '@shared';
import {
  SendFriendRequestBodySchema,
  RespondFriendRequestBodySchema,
} from '@contracts/friendships/friendships.validation';

import {
  getFriendsListController,
  getFriendshipsController,
  getPendingRequestsController,
  getSentRequestsController,
  sendFriendRequestController,
  respondFriendRequestController,
} from './friendships.controller';

function buildFriendshipsRouter(listController: RequestHandler): Router {
  const router = Router();
  router.use(requireAuth);

  router.get('/', listController);

  router.get('/requests/pending', getPendingRequestsController);

  router.get('/requests/sent', getSentRequestsController);

  router.post('/request', validateBody(SendFriendRequestBodySchema), sendFriendRequestController);

  router.post(
    '/respond',
    validateBody(RespondFriendRequestBodySchema),
    respondFriendRequestController,
  );

  return router;
}

/** GET / → FriendPublic[] (issue); same sub-routes as /friendships */
export const friendsRouter = buildFriendshipsRouter(getFriendsListController);

/** GET / → FriendshipPublic[] (legacy detailed shape) */
export const friendshipsRouter = buildFriendshipsRouter(getFriendshipsController);
