import app from '../backend/src/app';
import { connectDB } from '../backend/src/config/db';

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    await connectDB();
  } catch (e) {
    console.error('Database connection warning in api/index.ts:', e);
  }

  return app(req, res);
}
