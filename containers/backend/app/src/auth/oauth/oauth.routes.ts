import { Router } from 'express';
import passport from 'passport';

import { googleAuthenticateOptions } from './oauth.types';
import { getGoogleCallback } from './oauth.controller';

export const oauthRouter = Router();

oauthRouter.get(
  '/google',
  passport.authenticate(
    'google',
    googleAuthenticateOptions as unknown as passport.AuthenticateOptions,
  ),
);
oauthRouter.get('/callback/google', getGoogleCallback);
