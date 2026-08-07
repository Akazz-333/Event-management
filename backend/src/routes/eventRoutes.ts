import { Router } from 'express';
import { EventController } from '../controllers/eventController';
import {
  createEventValidator,
  updateEventValidator,
  getEventsQueryValidator,
  createTicketTypeValidator,
} from '../validators/eventValidator';
import { validateRequest } from '../middleware/validate';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/roles';
import { Role } from '../types';

const router = Router();

// Public routes
router.get('/', getEventsQueryValidator, validateRequest, EventController.getEvents);
router.get('/:id', EventController.getEventById);
router.get('/:eventId/tickets', EventController.getTicketTypes);

// Protected routes (Organizer & Admin)
router.post(
  '/',
  authenticate,
  authorize(Role.ORGANIZER, Role.ADMIN),
  createEventValidator,
  validateRequest,
  EventController.createEvent
);

router.put(
  '/:id',
  authenticate,
  authorize(Role.ORGANIZER, Role.ADMIN),
  updateEventValidator,
  validateRequest,
  EventController.updateEvent
);

router.delete(
  '/:id',
  authenticate,
  authorize(Role.ORGANIZER, Role.ADMIN),
  EventController.deleteEvent
);

router.post(
  '/:eventId/tickets',
  authenticate,
  authorize(Role.ORGANIZER, Role.ADMIN),
  createTicketTypeValidator,
  validateRequest,
  EventController.addTicketType
);

export default router;
