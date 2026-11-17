import mongoose from "mongoose";

const connectDB = async () => {
    try {
        if (!process.env.MONGO_URL) {
            console.warn("MONGO_URL not provided; continuing without database");
            return;
        }
        await mongoose.connect(process.env.MONGO_URL, {
            dbName: process.env.DB_NAME
        });

        console.log("Connected to MongoDB successfully");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error.message);
    }
};

export default connectDB;