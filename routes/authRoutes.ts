import { Router } from "express";
import { authUser, registerUser } from "../controllers/user.controller";

const authRouter = Router();
authRouter.post('/register',registerUser)
authRouter.post('/login',authUser)

export default authRouter;