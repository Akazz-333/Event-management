import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/authService';
import { sendSuccess } from '../utils/response';
import { AuthenticatedRequest } from '../types';

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      let { name, email, password, role } = req.body || {};
      if (email && !email.includes('@')) {
        email = `${email.trim()}@example.com`;
      }
      if (!name && email) {
        name = email.split('@')[0];
      }
      const result = await AuthService.register({ name, email, password, role });
      return sendSuccess(res, result, 'User registered successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      let { email, password } = req.body || {};
      if (email && !email.includes('@')) {
        email = `${email.trim()}@example.com`;
      }
      const result = await AuthService.login({ email, password });
      return sendSuccess(res, result, 'User logged in successfully', 200);
    } catch (error) {
      next(error);
    }
  }

  static async me(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const user = await AuthService.getUserProfile(userId);
      return sendSuccess(res, user, 'Profile retrieved successfully', 200);
    } catch (error) {
      next(error);
    }
  }

  static async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await AuthService.getAllUsers();
      return sendSuccess(res, users, 'Users retrieved successfully', 200);
    } catch (error) {
      next(error);
    }
  }
}
