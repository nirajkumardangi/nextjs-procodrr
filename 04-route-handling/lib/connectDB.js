import mongoose from "mongoose";
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/todos";

export default async function connectDB() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Database connected successfully!");
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1);
  }
}
