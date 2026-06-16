import { Router } from 'express';

import { requireAuth, validateBody } from '@shared';
import {
  AcceptGameInvitationBodySchema,
  SendGameInvitationBodySchema,
} from '@contracts/game-invitations/game-invitations.validation';

import {
  acceptGameInvitationController,
  getActiveGameInvitationSummaryController,
  getReceivedRoomInvitationsController,
  getSentRoomInvitationsController,
  sendGameInvitationController,
} from './game-invitations.controller';

export const gameInvitationsRouter = Router();

gameInvitationsRouter.use(requireAuth);
gameInvitationsRouter.get('/active', getActiveGameInvitationSummaryController);
gameInvitationsRouter.get('/sent-by-room', getSentRoomInvitationsController);
gameInvitationsRouter.get('/received-by-room', getReceivedRoomInvitationsController);
gameInvitationsRouter.post('/send', validateBody(SendGameInvitationBodySchema), sendGameInvitationController);
gameInvitationsRouter.post('/accept', validateBody(AcceptGameInvitationBodySchema), acceptGameInvitationController);
