import { Request, Response, NextFunction } from 'express';
import { EventService } from '../services/eventService';
import { sendSuccess } from '../utils/response';
import { AuthenticatedRequest, Role } from '../types';

export class EventController {
  static async createEvent(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const organizerId = req.user!.userId;
      const event = await EventService.createEvent(organizerId, req.body);
      return sendSuccess(res, event, 'Event created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  static async getEvents(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await EventService.getEvents(req.query as any);
      return sendSuccess(
        res,
        result.events,
        'Events retrieved successfully',
        200,
        result.pagination
      );
    } catch (error) {
      next(error);
    }
  }

  static async getEventById(req: Request, res: Response, next: NextFunction) {
    try {
      const event = await EventService.getEventById(req.params.id);
      return sendSuccess(res, event, 'Event details retrieved successfully', 200);
    } catch (error) {
      next(error);
    }
  }

  static async updateEvent(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const userRole = req.user!.role;
      const updated = await EventService.updateEvent(req.params.id, userId, userRole, req.body);
      return sendSuccess(res, updated, 'Event updated successfully', 200);
    } catch (error) {
      next(error);
    }
  }

  static async deleteEvent(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const userRole = req.user!.role;
      const result = await EventService.deleteEvent(req.params.id, userId, userRole);
      return sendSuccess(res, result, 'Event deleted successfully', 200);
    } catch (error) {
      next(error);
    }
  }

  static async addTicketType(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const userRole = req.user!.role;
      const ticketType = await EventService.addTicketType(
        req.params.eventId,
        userId,
        userRole,
        req.body
      );
      return sendSuccess(res, ticketType, 'Ticket type added successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  static async getTicketTypes(req: Request, res: Response, next: NextFunction) {
    try {
      const ticketTypes = await EventService.getTicketTypesByEvent(req.params.eventId);
      return sendSuccess(res, ticketTypes, 'Ticket types retrieved successfully', 200);
    } catch (error) {
      next(error);
    }
  }
}
