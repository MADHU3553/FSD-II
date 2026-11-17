import mongoose from "mongoose";

const connectDB = async () => {
    try {
        if (!process.env.MONGO_URL) {
            console.warn("MONGO_URL environment variable not provided; continuing without database");
            return;
        }
        await mongoose.connect(process.env.MONGO_URL, {
            dbName: process.env.DB_NAME
        });

        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
    }
};

export default connectDB;