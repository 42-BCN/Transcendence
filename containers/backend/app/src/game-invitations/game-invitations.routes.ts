import { Router } from 'express';

import { requireAuth, validateBody } from '@shared';
import {
  AcceptGameInvitationBodySchema,
  DeclineGameInvitationBodySchema,
  SendGameInvitationBodySchema,
} from '@contracts/game-invitations/game-invitations.validation';

import {
  acceptGameInvitationController,
  declineGameInvitationController,
  getGameInvitationStateController,
  sendGameInvitationController,
} from './game-invitations.controller';

export const gameInvitationsRouter = Router();

gameInvitationsRouter.use(requireAuth);
gameInvitationsRouter.get('/state', getGameInvitationStateController);
gameInvitationsRouter.post('/send', validateBody(SendGameInvitationBodySchema), sendGameInvitationController);
gameInvitationsRouter.post('/accept', validateBody(AcceptGameInvitationBodySchema), acceptGameInvitationController);
gameInvitationsRouter.post('/decline', validateBody(DeclineGameInvitationBodySchema), declineGameInvitationController);
