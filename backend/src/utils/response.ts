import { Response } from 'express';

export interface PaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export const sendSuccess = <T>(
  res: Response,
  data: T,
  message: string = 'Success',
  statusCode: number = 200,
  meta?: PaginationMeta
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    ...(meta ? { pagination: meta } : {}),
  });
};
