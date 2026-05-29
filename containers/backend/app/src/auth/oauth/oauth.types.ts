import type passport from 'passport';
import type { StrategyOptions } from 'passport-google-oauth20';

import { GoogleOauthStateStore } from './oauth.state-store';

const sessionSecret = process.env.SESSION_SECRET;

if (!sessionSecret) {
  throw new Error('SESSION_SECRET is required for Google OAuth state management');
}

export type GoogleStrategyOptionsWithBooleanState = Omit<StrategyOptions, 'state'> & {
  state: boolean;
};

export type GoogleAuthenticateOptionsWithBooleanState = Omit<
  passport.AuthenticateOptions,
  'state'
> & {
  state: boolean;
};

export const googleStrategyOptions: GoogleStrategyOptionsWithBooleanState = {
  clientID: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  callbackURL: process.env.GOOGLE_CALLBACK_URL!,
  scope: ['profile', 'email'],
  store: new GoogleOauthStateStore(sessionSecret),
  state: true,
};

export const googleAuthenticateOptions: GoogleAuthenticateOptionsWithBooleanState = {
  scope: ['profile', 'email'],
  prompt: 'select_account',
  state: true,
};
