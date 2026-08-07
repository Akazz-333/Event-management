import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/appError';
import { config } from '../config';

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let errors = err.errors || undefined;

  // Handle Prisma Specific Errors
  if (err.code === 'P2002') {
    statusCode = 409;
    message = 'Resource Conflict: A unique constraint violation occurred.';
  } else if (err.code === 'P2025') {
    statusCode = 404;
    message = 'Requested resource was not found.';
  }

  const responseBody: any = {
    success: false,
    error: {
      message,
      statusCode,
      ...(errors ? { errors } : {}),
      ...(config.nodeEnv === 'development' ? { stack: err.stack } : {}),
    },
  };

  return res.status(statusCode).json(responseBody);
};
