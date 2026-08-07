import dotenv from 'dotenv';
import mongoose from 'mongoose';
import dns from 'dns';

// Ensure .env is loaded immediately regardless of module import order
dotenv.config();

// Ensure Node.js resolves IPv4 DNS SRV records for MongoDB Atlas on Windows
try {
  dns.setDefaultResultOrder('ipv4first');
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (e) {}

export const isMongoDB = (): boolean => {
  const url = process.env.DATABASE_URL || '';
  return url.startsWith('mongodb://') || url.startsWith('mongodb+srv://');
};

export const connectDB = async (): Promise<void> => {
  if (isMongoDB()) {
    try {
      const mongoUrl = process.env.DATABASE_URL || 'mongodb://127.0.0.1:27017/event_management_db';
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
