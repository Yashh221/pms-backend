"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const authRouter = (0, express_1.Router)();
authRouter.post('/register', user_controller_1.registerUser);
authRouter.post('/login', user_controller_1.authUser);
exports.default = authRouter;
