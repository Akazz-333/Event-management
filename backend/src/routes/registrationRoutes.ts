import { Router } from 'express';
import { RegistrationController } from '../controllers/registrationController';
import {
  createRegistrationValidator,
  checkInValidator,
  registrationIdParamValidator,
} from '../validators/registrationValidator';
import { validateRequest } from '../middleware/validate';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/roles';
import { Role } from '../types';

const router = Router();

router.use(authenticate);

router.post('/', createRegistrationValidator, validateRequest, RegistrationController.register);
router.get('/my-tickets', RegistrationController.getMyTickets);
router.get('/:id', registrationIdParamValidator, validateRequest, RegistrationController.getTicketById);
router.post(
  '/:id/cancel',
  registrationIdParamValidator,
  validateRequest,
  RegistrationController.cancelRegistration
);

// Check-in venue endpoint for Event Organizers and Admins
router.post(
  '/check-in',
  authorize(Role.ORGANIZER, Role.ADMIN),
  checkInValidator,
  validateRequest,
  RegistrationController.checkIn
);

export default router;
