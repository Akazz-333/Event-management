import { EventService } from '../backend/src/services/eventService';
import { connectDB } from '../backend/src/config/db';

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    await connectDB();
  } catch (e) {}

  try {
    const category = (req.query?.category || '').toString();
    const q = (req.query?.q || '').toString();
    const page = Number(req.query?.page) || 1;
    const limit = Number(req.query?.limit) || 20;

    const result = await EventService.getEvents({ category, q, page, limit });
    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: { message: err?.message || 'Error fetching events' },
    });
  }
}
