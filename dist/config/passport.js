"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const passport_google_oauth20_1 = require("passport-google-oauth20");
const user_model_1 = require("../models/user.model");
const CALLBACK_URL = "http://localhost:7000/auth/google/callback";
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID || "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    callbackURL: CALLBACK_URL,
    passReqToCallback: true,
}, (req, accessToken, refreshToken, profile, next) => __awaiter(void 0, void 0, void 0, function* () {
    const defaultUser = {
        name: `${profile.displayName}`,
        email: profile.emails && profile.emails[0].value
            ? profile.emails[0].value
            : "",
        googleId: profile.id,
    };
    try {
        let user = yield user_model_1.User.findOne({ googleId: profile.id });
        if (!user) {
            user = yield user_model_1.User.create(defaultUser);
        }
        if (user)
            return next(null, user);
    }
    catch (error) {
        console.log("Error signing up:", error);
        next(error, undefined);
    }
})));
passport_1.default.serializeUser((user, done) => {
    done(null, user.id);
});
passport_1.default.deserializeUser((id, done) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findOne({ id }).catch((err) => {
        console.log(err);
        done(err, null);
    });
    console.log("Deserialized user", user);
    if (user)
        done(null, user);
}));
