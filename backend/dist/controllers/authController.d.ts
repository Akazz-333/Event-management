import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types';
export declare class AuthController {
    static register(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    static login(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    static me(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    static getUsers(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
}
