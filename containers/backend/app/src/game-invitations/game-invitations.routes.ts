import { Router } from 'express';

import { requireAuth, validateBody } from '@shared';
import {
  AcceptGameInvitationBodySchema,
  SendGameInvitationBodySchema,
} from '@contracts/game-invitations/game-invitations.validation';

import {
  acceptGameInvitationController,
  getActiveGameInvitationSummaryController,
  sendGameInvitationController,
} from './game-invitations.controller';

export const gameInvitationsRouter = Router();

gameInvitationsRouter.use(requireAuth);
gameInvitationsRouter.get('/active', getActiveGameInvitationSummaryController);
gameInvitationsRouter.post('/send', validateBody(SendGameInvitationBodySchema), sendGameInvitationController);
gameInvitationsRouter.post('/accept', validateBody(AcceptGameInvitationBodySchema), acceptGameInvitationController);
