import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { registerValidator, loginValidator } from '../validators/authValidator';
import { validateRequest } from '../middleware/validate';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/register', registerValidator, validateRequest, AuthController.register);
router.post('/login', loginValidator, validateRequest, AuthController.login);
router.get('/me', authenticate, AuthController.me);
router.get('/users', AuthController.getUsers);

export default router;
