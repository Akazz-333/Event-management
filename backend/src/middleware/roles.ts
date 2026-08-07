import { Response, NextFunction } from 'express';
import { AppError } from '../utils/appError';
import { AuthenticatedRequest, Role } from '../types';

export const authorize = (...allowedRoles: Role[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('Unauthorized access.', 401));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new AppError(
          `Forbidden. Role '${req.user.role}' does not have permission to access this resource. Required: [${allowedRoles.join(', ')}]`,
          403
        )
      );
    }

    next();
  };
};
