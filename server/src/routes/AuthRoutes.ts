import { Router } from "express";
import {
  addProfileImage,
  login,
  logOut,
  removeProfileImage,
  signup,
  updateProfile,
  userInfo,
} from "../controllers/AuthController";
import { verifyToken } from "../middlewares/AuthMiddleware";
import multer from "multer";

const authRoutes = Router();

const upload = multer({ dest: "uploads/profiles/" });

authRoutes.post("/signup", signup);
authRoutes.post("/login", login);
authRoutes.get("/user-info", verifyToken, userInfo);
authRoutes.put("/update-profile", verifyToken, updateProfile);
authRoutes.post(
  "/add-profile-image",
  verifyToken,
  upload.single("profile-image"),
  addProfileImage
);
authRoutes.delete("/remove-profile-image", verifyToken, removeProfileImage);
authRoutes.post("/logout", verifyToken, logOut);

export default authRoutes;
