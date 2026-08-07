"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const eventController_1 = require("../controllers/eventController");
const eventValidator_1 = require("../validators/eventValidator");
const validate_1 = require("../middleware/validate");
const auth_1 = require("../middleware/auth");
const roles_1 = require("../middleware/roles");
const types_1 = require("../types");
const router = (0, express_1.Router)();
// Public routes
router.get('/', eventValidator_1.getEventsQueryValidator, validate_1.validateRequest, eventController_1.EventController.getEvents);
router.get('/:id', eventController_1.EventController.getEventById);
router.get('/:eventId/tickets', eventController_1.EventController.getTicketTypes);
// Protected routes (Organizer & Admin)
router.post('/', auth_1.authenticate, (0, roles_1.authorize)(types_1.Role.ORGANIZER, types_1.Role.ADMIN), eventValidator_1.createEventValidator, validate_1.validateRequest, eventController_1.EventController.createEvent);
router.put('/:id', auth_1.authenticate, (0, roles_1.authorize)(types_1.Role.ORGANIZER, types_1.Role.ADMIN), eventValidator_1.updateEventValidator, validate_1.validateRequest, eventController_1.EventController.updateEvent);
router.delete('/:id', auth_1.authenticate, (0, roles_1.authorize)(types_1.Role.ORGANIZER, types_1.Role.ADMIN), eventController_1.EventController.deleteEvent);
router.post('/:eventId/tickets', auth_1.authenticate, (0, roles_1.authorize)(types_1.Role.ORGANIZER, types_1.Role.ADMIN), eventValidator_1.createTicketTypeValidator, validate_1.validateRequest, eventController_1.EventController.addTicketType);
exports.default = router;
