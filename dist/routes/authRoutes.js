"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const passport_1 = __importDefault(require("passport"));
require("../config/passport");
require("../config/github-passport");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const authRouter = (0, express_1.Router)();
authRouter.post("/register", user_controller_1.registerUser);
authRouter.post("/login", user_controller_1.authUser);
authRouter.get("/google", passport_1.default.authenticate("google", { scope: ["email", "profile"] }));
authRouter.get("/google/callback", passport_1.default.authenticate("google", {
    failureRedirect: "http://localhost:5173/login",
    successRedirect: "http://localhost:5173/login/success",
}), user_controller_1.googleCallback);
authRouter.get("/github", passport_1.default.authenticate("github", { scope: ["user:email"] }));
authRouter.get("/github/callback", passport_1.default.authenticate("github", {
    failureRedirect: "http://localhost:5173/login",
    successRedirect: "http://localhost:5173/",
}), user_controller_1.githubCallback);
authRouter.post("/forgotpassword", user_controller_1.forgotPassword);
authRouter.post("/resetpassword", user_controller_1.resetPassword);
authRouter.post("/selectRole", auth_middleware_1.protect, user_controller_1.selectRole);
exports.default = authRouter;
