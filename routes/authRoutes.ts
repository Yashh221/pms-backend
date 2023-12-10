import { Router } from "express";
import {
  authUser,
  forgotPassword,
  githubCallback,
  googleCallback,
  registerUser,
  resetPassword,
  selectRole,
} from "../controllers/user.controller";
import passport from "passport";
import "../config/passport";
import "../config/github-passport";
import { protect } from "../middlewares/auth.middleware";
import { createProxyMiddleware } from "http-proxy-middleware";

const authRouter = Router();
authRouter.post("/register", registerUser);
authRouter.post("/login", authUser);
authRouter.get(
  "/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

authRouter.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:5173/login",
    successRedirect: "http://localhost:5173/login/success",
  }),
  googleCallback
);

authRouter.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

authRouter.get(
  "/github/callback",
  passport.authenticate("github", {
    failureRedirect: "http://localhost:5173/login",
    successRedirect: "http://localhost:5173/",
  }),
  githubCallback
);

authRouter.post("/forgotpassword", forgotPassword);
authRouter.post("/resetpassword", resetPassword);
authRouter.post("/selectRole", protect, selectRole);

export default authRouter;
