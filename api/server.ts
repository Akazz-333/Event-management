import app from '../backend/src/app';
import { connectDB } from '../backend/src/config/db';

export default async function handler(req: any, res: any) {
  try {
    await connectDB();
    return app(req, res);
  } catch (err: any) {
    console.error('Unhandled serverless error:', err);
    return res.status(500).json({
      success: false,
      error: {
        message: err?.message || 'Internal Server Error',
        stack: process.env.NODE_ENV === 'development' ? err?.stack : undefined,
      },
    });
  }
}
