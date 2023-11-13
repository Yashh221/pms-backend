import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    const URI = process.env.MONGODB_URI;
    if (!URI) {
      throw new Error("MongoDB URI is not defined in your environment variables.");
    }

    const connection = await mongoose.connect(URI);

    console.log(`MongoDB Connected ${connection.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB ${error}`);
    process.exit()
  }
};

export default connectDB;
