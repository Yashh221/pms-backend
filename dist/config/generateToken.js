"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateToken = (id) => {
    const key = process.env.JWT_SECRET_KEY;
    if (!key) {
        throw new Error("Invalid Secret Key.");
    }
    return jsonwebtoken_1.default.sign({ id }, key, {
        expiresIn: "30d"
    });
};
exports.default = generateToken;
