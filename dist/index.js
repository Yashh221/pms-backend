"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const path = __importStar(require("path"));
const express_session_1 = __importDefault(require("express-session"));
const database_1 = __importDefault(require("./config/database"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const maintainerRoutes_1 = __importDefault(require("./routes/maintainerRoutes"));
const ownerRoutes_1 = __importDefault(require("./routes/ownerRoutes"));
const passport_1 = __importDefault(require("passport"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config({ path: path.resolve(__dirname, "../.env") });
const app = (0, express_1.default)();
(0, database_1.default)();
const PORT = process.env.PORT || "6000";
const secret = process.env.SESSION_SECRET || "";
app.listen(PORT, () => {
    console.log(`Connected to Port ${PORT}`);
});
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use((0, express_session_1.default)({
    secret: secret,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use("/auth", authRoutes_1.default);
app.use("/maintainer", maintainerRoutes_1.default);
app.use("/owner", ownerRoutes_1.default);
