import passport, { Profile } from "passport";
import dotenv from "dotenv";
dotenv.config();
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { User } from "../models/user.model";

const CALLBACK_URL = "http://localhost:7000/auth/google/callback";
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      callbackURL: CALLBACK_URL,
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, next) => {
      const defaultUser = {
        name: `${profile.displayName}`,
        email:
          profile.emails && profile.emails[0].value
            ? profile.emails[0].value
            : "",
        googleId: profile.id,
      };
      try {
        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
          user = await User.create(defaultUser);
        }
        if (user) return next(null, user);
      } catch (error: any) {
        console.log("Error signing up:", error);
        next(error, undefined);
      }
    }
  )
);
passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  const user = await User.findOne({ id }).catch((err) => {
    console.log(err);
    done(err, null);
  });
  console.log("Deserialized user", user);
  if (user) done(null, user);
});
