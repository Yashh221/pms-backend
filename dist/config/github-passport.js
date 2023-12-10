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
const passport_github2_1 = require("passport-github2");
const dotenv_1 = __importDefault(require("dotenv"));
const user_model_1 = require("../models/user.model");
dotenv_1.default.config();
passport_1.default.use(new passport_github2_1.Strategy({
    clientID: process.env.GITHUB_CLIENT_ID || "",
    clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    callbackURL: "http://localhost:7000/auth/github/callback",
    passReqToCallback: true,
}, (req, accessToken, refreshToken, profile, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(profile);
    const defaultUser = {
        name: `${profile._json.name}`,
        email: profile._json.email ? profile._json.email : "",
        githubId: profile._json.id,
    };
    try {
        let user = yield user_model_1.User.findOne({ githubId: profile.id });
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
