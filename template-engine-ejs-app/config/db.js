import mongoose from "mongoose";

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.warn("MONGO_URI environment variable not provided; continuing without database");
      return;
    }
    // Change MONGODB_URI to MONGO_URI
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: process.env.DB_NAME,
    });
    console.log(`MongoDB connected to database: ${process.env.DB_NAME}`);
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
  }
};

export default connectDB;
