import { Router } from 'express';

import { LoginReqSchema, SignupReqSchema } from '@contracts/auth/auth.validation';
import { validateBody } from '@shared/validation.middleware';

import {
  localLoginIdentifierRateLimit,
  localLoginIpRateLimit,
  localSignupEmailRateLimit,
} from './local.rate-limit';
import {
  getSessionIdentity,
  postGuestSession,
  postLogin,
  postLogout,
  postSignup,
} from './local.controller';

export const localRouter = Router();

localRouter.post('/signup', validateBody(SignupReqSchema), localSignupEmailRateLimit, postSignup);
localRouter.post(
  '/login',
  localLoginIpRateLimit,
  validateBody(LoginReqSchema),
  localLoginIdentifierRateLimit,
  postLogin,
);
localRouter.post('/logout', postLogout);
localRouter.post('/guest/session', postGuestSession);
localRouter.get('/session/identity', getSessionIdentity);
