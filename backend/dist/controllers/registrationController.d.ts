import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types';
export declare class RegistrationController {
    static register(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    static getMyTickets(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    static getTicketById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    static cancelRegistration(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    static checkIn(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
}
