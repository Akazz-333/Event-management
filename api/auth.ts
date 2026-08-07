import { AuthService } from '../backend/src/services/authService';
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

  const url = (req.url || '').toString();

  try {
    const { name, email, password, role } = req.body || {};
    
    if (url.includes('/register') || name) {
      const userName = name || (email ? email.split('@')[0] : 'User');
      const result = await AuthService.register({ name: userName, email, password, role });
      return res.status(201).json({ success: true, data: result });
    } else {
      const result = await AuthService.login({ email, password });
      return res.status(200).json({ success: true, data: result });
    }
  } catch (err: any) {
    return res.status(400).json({
      success: false,
      error: { message: err?.message || 'Authentication error' },
    });
  }
}
