import mongoose from "mongoose";

// mongoose.connection.readyState ===
// 0: Disconnected
// 1: Connecting
// 2: Connected
// 3: Disconnecting

let isConnected = false;

export default async function connectDB() {
  try {
    if (isConnected) {
      console.log("Database is already connected");
      return;
    }
    if (
      mongoose.connection.readyState === 1 ||
      mongoose.connection.readyState === 2
    ) {
      isConnected = true;
      console.log("Database is already connected");
      return;
    }
    const connect = await mongoose.connect(process.env.DATABASE_URL as string);
    isConnected = true;
    console.log(
      "Database connected successfully: ",
      connect.connection.host,
      connect.connection.name
    );
  } catch (error) {
    if (error instanceof Error) {
      console.error("Database connection failed", error.message);
      process.exit(1);
    }
  }
}
