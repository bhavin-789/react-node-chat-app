import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

interface CustomRequest extends Request {
  userId?: string;
}

export const verifyToken = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.jwt;
  if (!token) {
    return res.status(400).json({ message: "You are not authenticated!" });
  }
  jwt.verify(
    token,
    process.env.JWT_SECRET_KEY as string,
    async (err: any, payload: any) => {
      if (err) return res.status(403).send("Token is not valid!");
      req.userId = payload.userId;
      next();
    }
  );
};
