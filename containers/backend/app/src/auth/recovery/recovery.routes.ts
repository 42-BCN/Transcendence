import { Router } from 'express';

import { ResetPasswordReqSchema, RecoverReqSchema } from '@contracts/auth/auth.validation';
import { validateBody } from '@shared/validation.middleware';

import { recoveryRateLimit } from './recovery.rate-limit';

import { postRecover, postResetPassword } from './recovery.controller';

export const recoveryRouter = Router();

recoveryRouter.post('/recover', validateBody(RecoverReqSchema), recoveryRateLimit, postRecover);
recoveryRouter.post('/reset-password', validateBody(ResetPasswordReqSchema), postResetPassword);
