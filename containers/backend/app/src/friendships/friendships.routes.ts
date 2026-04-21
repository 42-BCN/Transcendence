import { Router } from 'express';

import { validateBody, validateParams, requireAuth } from '@shared';
import {
  SendFriendRequestBodySchema,
  RespondFriendRequestBodySchema,
  DeleteFriendshipParamSchema,
} from '@contracts/friendships/friendships.validation';

import {
  getFriendsListController,
  getFriendshipsController,
  getPendingRequestsController,
  getSentRequestsController,
  sendFriendRequestController,
  respondFriendRequestController,
  deleteFriendshipController,
} from './friendships.controller';

const router = Router();
router.use(requireAuth);

router.get('/', getFriendsListController);
router.get('/detailed', getFriendshipsController);
router.get('/requests/pending', getPendingRequestsController);
router.get('/requests/sent', getSentRequestsController);
router.post('/request', validateBody(SendFriendRequestBodySchema), sendFriendRequestController);
router.post(
  '/respond',
  validateBody(RespondFriendRequestBodySchema),
  respondFriendRequestController,
);
router.delete(
  '/:friendshipId',
  validateParams(DeleteFriendshipParamSchema),
  deleteFriendshipController,
);

export const friendsRouter = router;
