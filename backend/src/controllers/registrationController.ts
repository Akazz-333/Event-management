import { Response, NextFunction } from 'express';
import { RegistrationService } from '../services/registrationService';
import { sendSuccess } from '../utils/response';
import { AuthenticatedRequest } from '../types';

export class RegistrationController {
  static async register(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { eventId, ticketTypeId } = req.body;
      const registration = await RegistrationService.registerForEvent(
        userId,
        eventId,
        ticketTypeId
      );
      return sendSuccess(res, registration, 'Successfully registered for event', 201);
    } catch (error) {
      next(error);
    }
  }

  static async getMyTickets(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const tickets = await RegistrationService.getUserRegistrations(userId);
      return sendSuccess(res, tickets, 'User tickets retrieved successfully', 200);
    } catch (error) {
      next(error);
    }
  }

  static async getTicketById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const userRole = req.user!.role;
      const ticket = await RegistrationService.getRegistrationById(
        req.params.id,
        userId,
        userRole
      );
      return sendSuccess(res, ticket, 'Ticket details retrieved successfully', 200);
    } catch (error) {
      next(error);
    }
  }

  static async cancelRegistration(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const userRole = req.user!.role;
      const result = await RegistrationService.cancelRegistration(
        req.params.id,
        userId,
        userRole
      );
      return sendSuccess(res, result, 'Registration cancelled successfully', 200);
    } catch (error) {
      next(error);
    }
  }

  static async checkIn(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const userRole = req.user!.role;
      const { ticketCode } = req.body;
      const result = await RegistrationService.checkInAttendee(ticketCode, userId, userRole);
      return sendSuccess(res, result, 'Attendee checked-in successfully', 200);
    } catch (error) {
      next(error);
    }
  }
}
