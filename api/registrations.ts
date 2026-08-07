import { RegistrationService } from '../backend/src/services/registrationService';
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
    if (req.method === 'POST' && url.includes('/check-in')) {
      const { ticketCode } = req.body || {};
      const result = await RegistrationService.checkInTicket(ticketCode);
      return res.status(200).json({ success: true, data: result });
    } else if (req.method === 'POST') {
      const { eventId, ticketTypeId } = req.body || {};
      const userId = 'usr-default-attendee';
      const result = await RegistrationService.registerForEvent(userId, { eventId, ticketTypeId });
      return res.status(201).json({ success: true, data: result });
    } else {
      const userId = 'usr-default-attendee';
      const result = await RegistrationService.getUserRegistrations(userId);
      return res.status(200).json({ success: true, data: result });
    }
  } catch (err: any) {
    return res.status(400).json({
      success: false,
      error: { message: err?.message || 'Registration error' },
    });
  }
}
