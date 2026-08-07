import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const ATLAS_DEFAULT_URI = 'mongodb+srv://akazz33333_db_user:sb25102004@cluster0.3gnbcqu.mongodb.net/event_management_db?retryWrites=true&w=majority&appName=Cluster0';

let isConnected = false;

export const isMongoDB = (): boolean => {
  return true;
};

export const connectDB = async (): Promise<void> => {
  if (isConnected || mongoose.connection.readyState === 1) {
    isConnected = true;
    return;
  }

  try {
    let mongoUrl = process.env.DATABASE_URL || ATLAS_DEFAULT_URI;

    if (!mongoUrl || mongoUrl.includes('127.0.0.1') || mongoUrl.includes('localhost')) {
      mongoUrl = ATLAS_DEFAULT_URI;
    }

    await mongoose.connect(mongoUrl, {
      serverSelectionTimeoutMS: 4000,
      connectTimeoutMS: 4000,
      socketTimeoutMS: 5000,
      bufferCommands: false,
    });
    isConnected = true;
    console.log(`🍃 Connected to MongoDB Atlas database: ${mongoose.connection.db?.databaseName}`);
  } catch (error) {
    console.warn('⚠️ Database connection warning on serverless invocation:', error);
  }
};
