import express, { Express, NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import * as path from "path";
import connectDB from "./config/database";
import authRouter from "./routes/authRoutes";
import maintainerRouter from "./routes/maintainerRoutes";
import ownerRouter from "./routes/ownerRoutes";
import passport from "passport";
import cors from "cors";
import cookieSession from "cookie-session";
dotenv.config({ path: path.resolve(__dirname, "../.env") });
const app: Express = express();
import session from "express-session";

connectDB();
const PORT = process.env.PORT || "6000";
const secret = process.env.SESSION_SECRET || "";
app.listen(PORT, () => {
  console.log(`Connected to Port ${PORT}`);
});
app.use(cors({ credentials: true, origin: "http://localhost:5173" }));
app.use(express.json());
// app.use(
//   cookieSession({
//     keys: [secret],
//     maxAge: 0.5 * 1000,
//   })
// );
app.use(
  session({
    secret: secret,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true },
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use("/auth", authRouter);
app.use("/maintainer", maintainerRouter);
app.use("/owner", ownerRouter);
