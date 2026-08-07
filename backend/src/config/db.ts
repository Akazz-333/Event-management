import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const ATLAS_DEFAULT_URI = 'mongodb+srv://akazz33333_db_user:sb25102004@cluster0.3gnbcqu.mongodb.net/event_management_db?retryWrites=true&w=majority&appName=Cluster0';

export const isMongoDB = (): boolean => {
  return true;
};

export const connectDB = async (): Promise<void> => {
  try {
    let mongoUrl = process.env.DATABASE_URL || ATLAS_DEFAULT_URI;

    if (!mongoUrl || mongoUrl.includes('127.0.0.1') || mongoUrl.includes('localhost')) {
      mongoUrl = ATLAS_DEFAULT_URI;
    }

    if (mongoose.connection.readyState === 1 || mongoose.connection.readyState === 2) {
      return;
    }

    await mongoose.connect(mongoUrl, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`🍃 Connected to MongoDB Atlas database: ${mongoose.connection.db?.databaseName}`);
  } catch (error) {
    console.warn('⚠️ Database connection warning on serverless invocation:', error);
  }
};
