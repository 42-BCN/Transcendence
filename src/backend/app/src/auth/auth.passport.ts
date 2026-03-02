import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

import { findOrCreateGoogleUser } from "./auth.service";
import * as Repo from "./auth.repo";

passport.serializeUser((id: any, done) => {
  // console.log(user);
  if (!id) return done(new Error("serializeUser: user.id is missing"));
  done(null, id);
});

passport.deserializeUser((id: string, done) => {
  void (async () => {
    try {
      const user = await Repo.findUserById(id);
      if (!user) return done(null, false);
      done(null, user);
    } catch (err) {
      done(err as Error);
    }
  })();
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL!,
      scope: ["profile", "email"],
    },
    (_accessToken, _refreshToken, profile, done) => {
      void (async () => {
        try {
          const result = await findOrCreateGoogleUser(profile);
          if (!result.ok) return done(null, false);
          return done(null, result.value.id);
        } catch (err) {
          return done(err as Error);
        }
      })();
    },
  ),
);
