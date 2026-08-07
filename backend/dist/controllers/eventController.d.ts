import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types';
export declare class EventController {
    static createEvent(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    static getEvents(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    static getEventById(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    static updateEvent(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    static deleteEvent(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    static addTicketType(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    static getTicketTypes(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
}
