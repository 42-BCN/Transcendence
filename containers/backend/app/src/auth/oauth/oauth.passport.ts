import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import type { StrategyOptions } from 'passport-google-oauth20';

import { findOrCreateGoogleUser } from './oauth.service';
import { googleStrategyOptions } from './oauth.types';

passport.use(
  new GoogleStrategy(
    googleStrategyOptions as unknown as StrategyOptions,
    // DONT THROW INSIDE CALLBACKS
    (_accessToken, _refreshToken, profile, done) => {
      void (async () => {
        try {
          const user = await findOrCreateGoogleUser(profile);
          return done(null, user.id);
        } catch (err) {
          return done(err as Error);
        }
      })();
    },
  ),
);
