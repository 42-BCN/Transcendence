import type passport from 'passport';
import type { StrategyOptions } from 'passport-google-oauth20';

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
  state: true,
};

export const googleAuthenticateOptions: GoogleAuthenticateOptionsWithBooleanState = {
  scope: ['profile', 'email'],
  prompt: 'select_account',
  state: true,
};
