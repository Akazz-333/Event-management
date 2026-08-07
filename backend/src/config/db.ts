import dotenv from 'dotenv';
import mongoose from 'mongoose';
import dns from 'dns';

// Ensure .env is loaded immediately regardless of module import order
dotenv.config();

// Ensure Node.js resolves IPv4 DNS SRV records for MongoDB Atlas on Windows & Vercel
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
      
      // If running on Vercel cloud and local URI is detected, use Atlas cloud URI
      if (process.env.VERCEL && (mongoUrl.includes('127.0.0.1') || mongoUrl.includes('localhost') || !mongoUrl)) {
        mongoUrl = ATLAS_DEFAULT_URI;
      }

      if (mongoose.connection.readyState === 1) {
        return; // Already connected
      }

      await mongoose.connect(mongoUrl, {
        serverSelectionTimeoutMS: 15000,
      });
      console.log(`🍃 Connected to MongoDB database via Mongoose: ${mongoUrl.replace(/:[^:@]+@/, ':****@')}`);
    } catch (error) {
      console.error('❌ MongoDB Connection Error:', error);
    }
  } else {
    console.log('📁 Using SQLite / Prisma database engine');
  }
};
