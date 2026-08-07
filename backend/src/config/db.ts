import dotenv from 'dotenv';
import mongoose from 'mongoose';
import dns from 'dns';

dotenv.config();

try {
  dns.setDefaultResultOrder('ipv4first');
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (e) {}

const ATLAS_DEFAULT_URI = 'mongodb+srv://akazz33333_db_user:sb25102004@cluster0.3gnbcqu.mongodb.net/event_management_db?retryWrites=true&w=majority&appName=Cluster0';

export const isMongoDB = (): boolean => {
  const url = process.env.DATABASE_URL || '';
  if (process.env.VERCEL) return true;
  return url.startsWith('mongodb://') || url.startsWith('mongodb+srv://');
};

export const connectDB = async (): Promise<void> => {
  if (isMongoDB()) {
    try {
      let mongoUrl = process.env.DATABASE_URL || 'mongodb://127.0.0.1:27017/event_management_db';

      if (process.env.VERCEL && (mongoUrl.includes('127.0.0.1') || mongoUrl.includes('localhost') || !mongoUrl)) {
        mongoUrl = ATLAS_DEFAULT_URI;
      }

      if (mongoose.connection.readyState === 1 || mongoose.connection.readyState === 2) {
        return;
      }

      await mongoose.connect(mongoUrl, {
        serverSelectionTimeoutMS: 3000,
      });
      console.log(`🍃 Connected to MongoDB database via Mongoose`);
    } catch (error) {
      console.warn('⚠️ Database connection warning on serverless invocation:', error);
    }
  } else {
    console.log('📁 Using SQLite / Prisma database engine');
  }
};
