import { Router, Request, Response } from 'express';
import authRoutes from './authRoutes';
import eventRoutes from './eventRoutes';
import registrationRoutes from './registrationRoutes';
import { getPostmanCollection } from '../postman/collection';

const router = Router();

// Health Check
router.get('/health', (req: Request, res: Response) => {
  return res.status(200).json({
    status: 'UP',
    message: 'Event Management REST API is healthy and operational.',
    timestamp: new Date().toISOString(),
  });
});

// Dynamic Postman Collection Export Endpoint
router.get('/postman-collection', (req: Request, res: Response) => {
  const protocol = req.protocol;
  const host = req.get('host');
  const baseUrl = `${protocol}://${host}`;
  const collection = getPostmanCollection(baseUrl);
  
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', 'attachment; filename="event_management_api.postman_collection.json"');
  return res.status(200).json(collection);
});

// Mount Resource Routes
router.use('/auth', authRoutes);
router.use('/events', eventRoutes);
router.use('/registrations', registrationRoutes);

export default router;
