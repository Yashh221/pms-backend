import express, { Express } from "express";
import dotenv from "dotenv";
import * as path from "path";
import session from "express-session";
import connectDB from "./config/database";
import authRouter from "./routes/authRoutes";
import maintainerRouter from "./routes/maintainerRoutes";
import ownerRouter from "./routes/ownerRoutes";
import passport from "passport";
import cors from "cors";
dotenv.config({ path: path.resolve(__dirname, "../.env") });
const app: Express = express();

connectDB();
const PORT = process.env.PORT || "6000";
const secret = process.env.SESSION_SECRET || "";
app.listen(PORT, () => {
  console.log(`Connected to Port ${PORT}`);
});
app.use(cors());
app.use(express.json());
app.use(
  session({
    secret: secret,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use("/auth", authRouter);
app.use("/maintainer", maintainerRouter);
app.use("/owner", ownerRouter);
