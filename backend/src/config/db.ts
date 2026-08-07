import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const ATLAS_DEFAULT_URI = 'mongodb+srv://akazz33333_db_user:sb25102004@cluster0.3gnbcqu.mongodb.net/event_management_db?retryWrites=true&w=majority&appName=Cluster0';

let isConnected = false;

export const isMongoDB = (): boolean => {
  return true;
};

export const connectDB = async (): Promise<void> => {
  if (isConnected && mongoose.connection.readyState === 1) {
    return;
  }

  try {
    let mongoUrl = ATLAS_DEFAULT_URI;
    if (process.env.DATABASE_URL && process.env.DATABASE_URL.includes('cluster0.3gnbcqu.mongodb.net')) {
      mongoUrl = process.env.DATABASE_URL;
    }

    await mongoose.connect(mongoUrl, {
      serverSelectionTimeoutMS: 8000,
      connectTimeoutMS: 8000,
    });
    isConnected = true;
    console.log(`🍃 Connected to MongoDB Atlas database: ${mongoose.connection.db?.databaseName}`);
  } catch (error) {
    console.warn('⚠️ Database connection warning on serverless invocation:', error);
  }
};
