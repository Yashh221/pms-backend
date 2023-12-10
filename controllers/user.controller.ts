import asyncHandler from "express-async-handler";
import { NextFunction, Request, Response } from "express";
import { User } from "../models/user.model";
import generateToken from "../config/generateToken";
import { sendEmail } from "../config/email";
import { Otp } from "../models/otp.model";
import bcrypt from "bcryptjs";

export const registerUser = asyncHandler(
  async (req: Request, res: Response) => {
    const { name, email, password, role, phoneNum } = req.body;
    console.log(req.body);
    if (!name || !email || !password) {
      res.status(400).json({ message: "Please Enter all the fields" });
      return;
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400).json({ message: "User already registered" });
    }
    const user = await User.create({
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
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: "Failed to register the user" });
    }
  }
);

export const authUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(404).json({ message: "Email or password are missing." });
    return;
  }

  const user = await User.findOne({ email });

  if (user && (await user.isValidatePassword(password))) {
    res.status(200).json({
      success: true,
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(404).json({ message: "Invalid Credentials" });
  }
});

//google auth

export const googleCallback = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    console.log("Google Callback Reached");
    res.send("heelo workd");
  }
);
//github auth
export const githubCallback = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    res.redirect("http://localhost:5173/");
  }
);

// select role

export const selectRole = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { userId, role } = req.body;
    if (!userId || !role) {
      res
        .status(400)
        .json({ message: "Please select role for the valid user" });
      return;
    }
    const user = await User.findByIdAndUpdate(
      userId,
      {
        role,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    if (user) {
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export const forgotPassword = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      if (!email) {
        res.status(404).json({ message: "Please fill all the details" });
        return;
      }

      const user = await User.findOne({ email });
      const otpCode = Math.floor(Math.random() * 9000) + 1000;
      const otpData = new Otp({
        email,
        otpCode,
        expiresIn: new Date().getTime() + 300 * 1000,
      });
      console.log(otpData);
      const otpResponse = await otpData.save();
      if (user && otpResponse) {
        sendEmail(otpData);
      }
      res.status(200).json({ success: true, data: user });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

export const resetPassword = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { email, otp, password } = req.body;
      if (!email || !otp || !password) {
        res.status(404).json({ message: "Please fill all the details" });
        return;
      }
      let user = await Otp.findOne({ email }).limit(1).sort({ $natural: -1 });
      let timeExpire = user && user.expiresIn.getTime() - new Date().getTime();
      if (timeExpire && timeExpire < 0) {
        res.status(404).json({ message: "Otp Expired" });
        return;
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      if (user && timeExpire && timeExpire > 0) {
        user = await User.findOneAndUpdate(
          {
            email: user.email,
          },
          {
            $set: {
              password: hashedPassword,
            },
          }
        );
      }
      res.status(200).json({ success: true, data: user });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);
