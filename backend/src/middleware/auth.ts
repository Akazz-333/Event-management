import { Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { AppError } from '../utils/appError';
import { AuthenticatedRequest } from '../types';

export const authenticate = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Authentication required. Missing Bearer token.', 401);
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new AppError('Authentication failed. Empty token provided.', 401);
    }

    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error: any) {
    if (error.name === 'JsonWebTokenError') {
      return next(new AppError('Invalid token signature.', 401));
    }
    if (error.name === 'TokenExpiredError') {
      return next(new AppError('Token has expired. Please log in again.', 401));
    }
    next(error);
  }
};
