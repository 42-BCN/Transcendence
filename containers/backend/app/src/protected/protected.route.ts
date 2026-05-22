import { Router } from 'express';

import { ChangePasswordReqSchema } from '@contracts/auth/auth.validation';
import { UpdateMeProfileReqSchema } from '@contracts/users/users.validation';
import { requireAuth } from '@shared';
import { validateBody } from '@shared/validation.middleware';

import { deleteMe, getMeProfile, postMeResetPassword, putMeProfile } from './protected.controller';

export const protectedRouter = Router();

protectedRouter.get('/me', requireAuth, (req, res) => {
  res.status(200).json({
    ok: true,
    data: {
      userId: req.session.userId,
    },
  });
});

protectedRouter.get('/me/profile', requireAuth, getMeProfile);
protectedRouter.put('/me/profile', requireAuth, validateBody(UpdateMeProfileReqSchema), putMeProfile);
protectedRouter.post(
  '/me/reset-password',
  requireAuth,
  validateBody(ChangePasswordReqSchema),
  postMeResetPassword,
);
protectedRouter.delete('/me', requireAuth, deleteMe);
