"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventController = void 0;
const eventService_1 = require("../services/eventService");
const response_1 = require("../utils/response");
class EventController {
    static async createEvent(req, res, next) {
        try {
            const organizerId = req.user.userId;
            const event = await eventService_1.EventService.createEvent(organizerId, req.body);
            return (0, response_1.sendSuccess)(res, event, 'Event created successfully', 201);
        }
        catch (error) {
            next(error);
        }
    }
    static async getEvents(req, res, next) {
        try {
            const result = await eventService_1.EventService.getEvents(req.query);
            return (0, response_1.sendSuccess)(res, result.events, 'Events retrieved successfully', 200, result.pagination);
        }
        catch (error) {
            next(error);
        }
    }
    static async getEventById(req, res, next) {
        try {
            const event = await eventService_1.EventService.getEventById(req.params.id);
            return (0, response_1.sendSuccess)(res, event, 'Event details retrieved successfully', 200);
        }
        catch (error) {
            next(error);
        }
    }
    static async updateEvent(req, res, next) {
        try {
            const userId = req.user.userId;
            const userRole = req.user.role;
            const updated = await eventService_1.EventService.updateEvent(req.params.id, userId, userRole, req.body);
            return (0, response_1.sendSuccess)(res, updated, 'Event updated successfully', 200);
        }
        catch (error) {
            next(error);
        }
    }
    static async deleteEvent(req, res, next) {
        try {
            const userId = req.user.userId;
            const userRole = req.user.role;
            const result = await eventService_1.EventService.deleteEvent(req.params.id, userId, userRole);
            return (0, response_1.sendSuccess)(res, result, 'Event deleted successfully', 200);
        }
        catch (error) {
            next(error);
        }
    }
    static async addTicketType(req, res, next) {
        try {
            const userId = req.user.userId;
            const userRole = req.user.role;
            const ticketType = await eventService_1.EventService.addTicketType(req.params.eventId, userId, userRole, req.body);
            return (0, response_1.sendSuccess)(res, ticketType, 'Ticket type added successfully', 201);
        }
        catch (error) {
            next(error);
        }
    }
    static async getTicketTypes(req, res, next) {
        try {
            const ticketTypes = await eventService_1.EventService.getTicketTypesByEvent(req.params.eventId);
            return (0, response_1.sendSuccess)(res, ticketTypes, 'Ticket types retrieved successfully', 200);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.EventController = EventController;
