import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { AppError } from '../utils/appError';

export const validateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((err) => ({
      field: (err as any).path || (err as any).param,
      message: err.msg,
    }));
    return next(new AppError('Validation Failed', 400, formattedErrors));
  }
  next();
};
