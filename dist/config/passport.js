"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const passport_google_oauth20_1 = require("passport-google-oauth20");
const user_model_1 = require("../models/user.model");
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID || "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    callbackURL: `http://localhost:5173/auth/google/callback`,
}, (accessToken, refreshToken, profile, next) => {
    user_model_1.User.findOne({ email: profile._json.email }).then((user) => {
        if (user) {
            console.log("User already exists in Database");
            next(null, user);
            // cookieToken()
        }
        else {
            user_model_1.User.create({
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
