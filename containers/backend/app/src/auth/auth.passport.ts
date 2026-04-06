import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

import { findOrCreateGoogleUser } from './auth.service';

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL!,
      scope: ['profile', 'email'],
    },
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
