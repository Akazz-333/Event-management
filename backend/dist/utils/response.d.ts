import { Response } from 'express';
export interface PaginationMeta {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
}
export declare const sendSuccess: <T>(res: Response, data: T, message?: string, statusCode?: number, meta?: PaginationMeta) => Response<any, Record<string, any>>;
