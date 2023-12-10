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
exports.resetPassword = exports.forgotPassword = exports.selectRole = exports.githubCallback = exports.googleCallback = exports.authUser = exports.registerUser = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const user_model_1 = require("../models/user.model");
const generateToken_1 = __importDefault(require("../config/generateToken"));
const email_1 = require("../config/email");
const otp_model_1 = require("../models/otp.model");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
exports.registerUser = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password, role, phoneNum } = req.body;
    console.log(req.body);
    if (!name || !email || !password) {
        res.status(400).json({ message: "Please Enter all the fields" });
        return;
    }
    const userExists = yield user_model_1.User.findOne({ email });
    if (userExists) {
        res.status(400).json({ message: "User already registered" });
    }
    const user = yield user_model_1.User.create({
        name,
        email,
        password,
        role,
        phoneNum,
    });
    if (user) {
        res.status(201).json({
            success: true,
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            phoneNum: user.phoneNum,
            token: (0, generateToken_1.default)(user._id),
        });
    }
    else {
        res.status(400).json({ message: "Failed to register the user" });
    }
}));
exports.authUser = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(404).json({ message: "Email or password are missing." });
        return;
    }
    const user = yield user_model_1.User.findOne({ email });
    if (user && (yield user.isValidatePassword(password))) {
        res.status(200).json({
            success: true,
            _id: user._id,
            name: user.name,
            email: user.email,
            token: (0, generateToken_1.default)(user._id),
        });
    }
    else {
        res.status(404).json({ message: "Invalid Credentials" });
    }
}));
//google auth
exports.googleCallback = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Google Callback Reached");
    res.send("heelo workd");
}));
//github auth
exports.githubCallback = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    res.redirect("http://localhost:5173/");
}));
// select role
exports.selectRole = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, role } = req.body;
        if (!userId || !role) {
            res
                .status(400)
                .json({ message: "Please select role for the valid user" });
            return;
        }
        const user = yield user_model_1.User.findByIdAndUpdate(userId, {
            role,
        }, {
            new: true,
            runValidators: true,
        });
        if (user) {
            res.status(200).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            });
        }
    }
    catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
}));
exports.forgotPassword = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        if (!email) {
            res.status(404).json({ message: "Please fill all the details" });
            return;
        }
        const user = yield user_model_1.User.findOne({ email });
        const otpCode = Math.floor(Math.random() * 9000) + 1000;
        const otpData = new otp_model_1.Otp({
            email,
            otpCode,
            expiresIn: new Date().getTime() + 300 * 1000,
        });
        console.log(otpData);
        const otpResponse = yield otpData.save();
        if (user && otpResponse) {
            (0, email_1.sendEmail)(otpData);
        }
        res.status(200).json({ success: true, data: user });
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}));
exports.resetPassword = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, otp, password } = req.body;
        if (!email || !otp || !password) {
            res.status(404).json({ message: "Please fill all the details" });
            return;
        }
        let user = yield otp_model_1.Otp.findOne({ email }).limit(1).sort({ $natural: -1 });
        let timeExpire = user && user.expiresIn.getTime() - new Date().getTime();
        if (timeExpire && timeExpire < 0) {
            res.status(404).json({ message: "Otp Expired" });
            return;
        }
        const salt = yield bcryptjs_1.default.genSalt(10);
        const hashedPassword = yield bcryptjs_1.default.hash(password, salt);
        if (user && timeExpire && timeExpire > 0) {
            user = yield user_model_1.User.findOneAndUpdate({
                email: user.email,
            }, {
                $set: {
                    password: hashedPassword,
                },
            });
        }
        res.status(200).json({ success: true, data: user });
    }
    catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
}));
