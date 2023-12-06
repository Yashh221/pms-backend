import passport from "passport";
import dotenv from "dotenv";
dotenv.config();
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { User } from "../models/user.model";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      callbackURL: `http://localhost:7000/auth/google/callback`,
    },
    (accessToken, refreshToken, profile, next) => {
      User.findOne({ email: profile._json.email }).then((user) => {
        if (user) {
          console.log("User already exists in Database");
          next(null, user);
          // cookieToken()
        } else {
          User.create({
            name: profile.displayName,
            googleId: profile.id,
            email: profile._json.email,
          })
            .then((user) => {
              console.log("New User ", user);
              next(null, user);
            })
            .catch((err) => {
              console.log(err);
            });
        }
      });
    }
  )
);
passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user: { _id: string }, done) => {
  User.findById(user._id)
    .then((user) => {
      done(null, user);
    })
    .catch((err) => {
      done(err, null);
    });
});
