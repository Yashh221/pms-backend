import { Router } from "express";
import {
  authUser,
  githubCallback,
  googleCallback,
  registerUser,
  selectRole,
} from "../controllers/user.controller";
import passport from "passport";
import "../config/passport";
import "../config/github-passport";
import { protect } from "../middlewares/auth.middleware";

const authRouter = Router();
authRouter.post("/register", registerUser);
authRouter.post("/login", authUser);
authRouter.get(
  "/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

authRouter.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  googleCallback
);

authRouter.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

authRouter.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  githubCallback
);

authRouter.post("/selectRole", protect, selectRole);

export default authRouter;
