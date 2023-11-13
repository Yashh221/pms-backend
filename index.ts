import express, {Express } from "express";
import dotenv from 'dotenv'
import * as path from 'path';
import connectDB from "./config/database";
import authRouter from "./routes/authRoutes";
dotenv.config({path:path.resolve(__dirname, '../.env') })
const app : Express = express()

connectDB();
const PORT = process.env.PORT || '6000';
app.listen(PORT, () =>{
    console.log(`Connected to Port ${PORT}`)
})
app.use(express.json());
app.use('/auth/',authRouter)

