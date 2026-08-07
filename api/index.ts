import app from '../backend/src/app';
import { connectDB } from '../backend/src/config/db';

export default async function handler(req: any, res: any) {
  try {
    await connectDB();
  } catch (e) {}
  return app(req, res);
}
