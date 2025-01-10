import mongoose from "mongoose";
import dotenv from "dotenv";
const env = dotenv.config()
const connectToDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGOOSE_URL);
        console.log("Connected to the database successfully.");
    } catch (error) {
        console.error("Database connection failed:", error);
    }
};

export default connectToDatabase;
