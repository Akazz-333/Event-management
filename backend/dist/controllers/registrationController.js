"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegistrationController = void 0;
const registrationService_1 = require("../services/registrationService");
const response_1 = require("../utils/response");
class RegistrationController {
    static async register(req, res, next) {
        try {
            const userId = req.user.userId;
            const { eventId, ticketTypeId } = req.body;
            const registration = await registrationService_1.RegistrationService.registerForEvent(userId, eventId, ticketTypeId);
            return (0, response_1.sendSuccess)(res, registration, 'Successfully registered for event', 201);
        }
        catch (error) {
            next(error);
        }
    }
    static async getMyTickets(req, res, next) {
        try {
            const userId = req.user.userId;
            const tickets = await registrationService_1.RegistrationService.getUserRegistrations(userId);
            return (0, response_1.sendSuccess)(res, tickets, 'User tickets retrieved successfully', 200);
        }
        catch (error) {
            next(error);
        }
    }
    static async getTicketById(req, res, next) {
        try {
            const userId = req.user.userId;
            const userRole = req.user.role;
            const ticket = await registrationService_1.RegistrationService.getRegistrationById(req.params.id, userId, userRole);
            return (0, response_1.sendSuccess)(res, ticket, 'Ticket details retrieved successfully', 200);
        }
        catch (error) {
            next(error);
        }
    }
    static async cancelRegistration(req, res, next) {
        try {
            const userId = req.user.userId;
            const userRole = req.user.role;
            const result = await registrationService_1.RegistrationService.cancelRegistration(req.params.id, userId, userRole);
            return (0, response_1.sendSuccess)(res, result, 'Registration cancelled successfully', 200);
        }
        catch (error) {
            next(error);
        }
    }
    static async checkIn(req, res, next) {
        try {
            const userId = req.user.userId;
            const userRole = req.user.role;
            const { ticketCode } = req.body;
            const result = await registrationService_1.RegistrationService.checkInAttendee(ticketCode, userId, userRole);
            return (0, response_1.sendSuccess)(res, result, 'Attendee checked-in successfully', 200);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.RegistrationController = RegistrationController;
