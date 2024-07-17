import { Request, Response } from "express";
import UserModel from "../models/UserModel";
import { sign } from "jsonwebtoken";
import { compare } from "bcrypt";

const maxAge = 3 * 24 * 60 * 60 * 1000;

const createToken = (email: string, userId: string) => {
  return sign({ email, userId }, process.env.JWT_SECRET_KEY as string, {
    expiresIn: maxAge,
  });
};

export const signup = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and Password both are required!" });
    }
    const user = await UserModel.create({ email, password });
    res.cookie("jwt", createToken(email, user._id), {
      maxAge,
      secure: true,
      sameSite: "none",
    });
    return res.status(201).json({
      user: {
        id: user._id,
        email: user.email,
        profileSetup: user.profileSetup,
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      console.log("Error while create the user", error.message);
      return res.status(500).json({ message: "Internal Server Error!" });
    }
  }
};
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and Password both are required!" });
    }
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ message: "User with the given email not found!" });
    }
    const auth = await compare(password, user.password);
    if (!auth) {
      return res.status(400).json({ message: "Password is incorrect!" });
    }

    res.cookie("jwt", createToken(email, user._id), {
      maxAge,
      secure: true,
      sameSite: "none",
    });
    return res.status(200).json({
      user: {
        id: user._id,
        email: user.email,
        profileSetup: user.profileSetup,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image,
        color: user.color,
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      console.log("Error while login the user", error.message);
      return res.status(500).json({ message: "Internal Server Error!" });
    }
  }
};
