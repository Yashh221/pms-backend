"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_github2_1 = require("passport-github2");
const dotenv_1 = __importDefault(require("dotenv"));
const user_model_1 = require("../models/user.model");
dotenv_1.default.config();
passport_1.default.use(new passport_github2_1.Strategy({
    clientID: process.env.GITHUB_CLIENT_ID || "",
    clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    callbackURL: "http://localhost:7000/auth/github/callback",
}, (accessToken, refreshToken, profile, next) => {
    console.log(profile);
    user_model_1.User.findOne({ email: profile._json.email }).then((user) => {
        if (user) {
            console.log("User already exists in Database");
            next(null, user);
            // cookieToken()
        }
        else {
            user_model_1.User.create({
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
}));
passport_1.default.serializeUser((user, done) => {
    done(null, user);
});
passport_1.default.deserializeUser((user, done) => {
    user_model_1.User.findById(user._id)
        .then((user) => {
        done(null, user);
    })
        .catch((err) => {
        done(err, null);
    });
});
