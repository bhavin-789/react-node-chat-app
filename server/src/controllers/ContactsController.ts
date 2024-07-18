import { Request, Response } from "express";
import UserModel from "../models/UserModel";

interface CustomRequest extends Request {
  userId?: string;
}

export const searchContacts = async (req: CustomRequest, res: Response) => {
  try {
    const { searchTerm } = req.body;
    if (searchTerm === undefined || searchTerm === null) {
      return res.status(400).json({ message: "searchTerm is required!" });
    }

    const sanitizedSearchTerm = searchTerm.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&"
    );
    const regex = new RegExp(sanitizedSearchTerm, "i");
    const contacts = await UserModel.find({
      $and: [
        { _id: { $ne: req.userId } },
        { $or: [{ firstName: regex }, { lastName: regex }, { email: regex }] },
      ],
    });

    return res.status(200).json({contacts});
  } catch (error) {
    if (error instanceof Error) {
      console.log("Error while searching the contacts", error.message);
      return res.status(500).json({ message: "Internal Server Error!" });
    }
  }
};
