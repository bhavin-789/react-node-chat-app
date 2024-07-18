import { Request, Response } from "express";
import UserModel from "../models/UserModel";
import { sign } from "jsonwebtoken";
import { compare } from "bcrypt";
import { renameSync, unlinkSync } from "fs";

interface CustomRequest extends Request {
  userId?: string;
}

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

export const userInfo = async (req: CustomRequest, res: Response) => {
  try {
    const userData = await UserModel.findById(req.userId);
    if (!userData) {
      return res
        .status(404)
        .json({ message: "User with the given id not found." });
    }
    return res.status(200).json({
      id: userData._id,
      email: userData.email,
      profileSetup: userData.profileSetup,
      firstName: userData.firstName,
      lastName: userData.lastName,
      image: userData.image,
      color: userData.color,
    });
  } catch (error) {
    if (error instanceof Error) {
      console.log("Error while fetching the user info", error.message);
      return res.status(500).json({ message: "Internal Server Error!" });
    }
  }
};

export const updateProfile = async (req: CustomRequest, res: Response) => {
  try {
    const { userId } = req;
    const { firstName, lastName, color } = req.body;
    if (!firstName || !lastName) {
      return res
        .status(401)
        .json({ message: "Firstname, lastname and color are required!" });
    }
    const userData = await UserModel.findByIdAndUpdate(
      userId,
      { firstName, lastName, color, profileSetup: true },
      { new: true }
    );

    return res.status(200).json({
      id: userData._id,
      email: userData.email,
      profileSetup: userData.profileSetup,
      firstName: userData.firstName,
      lastName: userData.lastName,
      image: userData.image,
      color: userData.color,
    });
  } catch (error) {
    if (error instanceof Error) {
      console.log("Error while fetching the user info", error.message);
      return res.status(500).json({ message: "Internal Server Error!" });
    }
  }
};

export const addProfileImage = async (req: CustomRequest, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Image is required!" });
    }

    const date = Date.now();
    let fileName = "uploads/profiles/" + date + req.file.originalname;
    renameSync(req.file.path, fileName);

    const updatedUser = await UserModel.findByIdAndUpdate(
      req.userId,
      { image: fileName },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      image: updatedUser.image,
    });
  } catch (error) {
    if (error instanceof Error) {
      console.log("Error while adding the user image", error.message);
      return res.status(500).json({ message: "Internal Server Error!" });
    }
  }
};

export const removeProfileImage = async (req: CustomRequest, res: Response) => {
  try {
    const { userId } = req;
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }
    if (user.image) {
      unlinkSync(user.image);
    }
    user.image = null;
    await user.save();
    return res
      .status(200)
      .json({ message: "Profile image removed successfully." });
  } catch (error) {
    if (error instanceof Error) {
      console.log("Error while removing the user image", error.message);
      return res.status(500).json({ message: "Internal Server Error!" });
    }
  }
};

export const logOut = async (req: Request, res: Response) => {
  try {
    // res.cookie("jwt", "", { maxAge: 1, secure: true, sameSite: "none" });
    res.clearCookie("jwt");
    return res.status(200).json({ message: "Logout successfully." });
  } catch (error) {
    if (error instanceof Error) {
      console.log("Error while logging out the user", error.message);
      return res.status(500).json({ message: "Internal Server Error!" });
    }
  }
};
