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
      passReqToCallback: true,
    },
    async (
      req: any,
      accessToken: string,
      refreshToken: string,
      profile: any,
      next: any
    ) => {
      console.log(profile);
      const defaultUser = {
        name: `${profile._json.name}`,
        email: profile._json.email ? profile._json.email : "",
        githubId: profile._json.id,
      };
      try {
        let user = await User.findOne({ githubId: profile.id });
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
