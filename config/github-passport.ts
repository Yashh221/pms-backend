import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";
import dotenv from "dotenv";
import { User } from "../models/user.model";
dotenv.config();

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
      callbackURL: "http://localhost:7000/auth/github/callback",
    },
    (accessToken, refreshToken, profile, next) => {
      console.log(profile);
      User.findOne({ email: profile._json.email }).then((user) => {
        if (user) {
          console.log("User already exists in Database");
          next(null, user);
          // cookieToken()
        } else {
          User.create({
            githubId: profile._json.id,
            name: profile._json.name,
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
