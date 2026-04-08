import { Router } from 'express';

import { ResendVerificationReqSchema, VerifyEmailReqSchema } from '@contracts/auth/auth.validation';
import { validateBody } from '@shared/validation.middleware';

import { verificationResendEmailRateLimit } from './verification.rate-limit';
import { postResendVerification, postVerifyEmail } from './verification.controller';

export const verificationRouter = Router();

verificationRouter.post(
  '/resend-verification',
  validateBody(ResendVerificationReqSchema),
  verificationResendEmailRateLimit,
  postResendVerification,
);
verificationRouter.post('/verify-email', validateBody(VerifyEmailReqSchema), postVerifyEmail);
