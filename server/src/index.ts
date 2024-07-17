import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import connectDB from "./config/dbConnection";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/AuthRoutes";
const app = express();
const port = process.env.PORT || 8001;

connectDB();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: [process.env.ORIGIN as string],
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(cookieParser());

app.use("/api/auth", authRoutes);

app.listen(port, () => {
  console.log(`⚙️ Server is running at http://localhost:${port}`);
});