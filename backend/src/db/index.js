import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI, {
            dbName: DB_NAME
        });
        console.log(`\n MongoDB connected! DB HOST: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.error("MongoDB connection FAILED: ", error);
        process.exit(1); // Stop the Node process if database connection fails
    }
};

export default connectDB;
