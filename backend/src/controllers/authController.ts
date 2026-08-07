import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/authService';
import { sendSuccess } from '../utils/response';
import { AuthenticatedRequest } from '../types';

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AuthService.register(req.body);
      return sendSuccess(res, result, 'User registered successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AuthService.login(req.body);
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
