import asyncHandler from "express-async-handler";
import { NextFunction, Request, Response } from "express";
import { User } from "../models/user.model";
import generateToken from "../config/generateToken";

export const registerUser = asyncHandler(
  async (req: Request, res: Response) => {
    const { name, email, password, role, phoneNum } = req.body;
    if (!name || !email || !password || !role || !phoneNum) {
      res.status(400);
      throw new Error("Please Enter all the fields");
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error("User already registered");
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
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phoneNum: user.phoneNum,
        token: generateToken(user._id),
      });
    } else {
      res.status(400);
      throw new Error("Failed to register the user");
    }
  }
);

export const authUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(404);
    throw new Error("Email or password are missing.");
  }

  const user = await User.findOne({ email });

  if (user && (await user.isValidatePassword(password))) {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(404);
    throw new Error("Invalid Credentials");
  }
});

//google auth

export const googleCallback = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    res.send(req.user);
  }
);
//github auth
export const githubCallback = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    res.send(req.user);
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
