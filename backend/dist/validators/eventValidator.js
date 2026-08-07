"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTicketTypeValidator = exports.getEventsQueryValidator = exports.updateEventValidator = exports.createEventValidator = void 0;
const express_validator_1 = require("express-validator");
const types_1 = require("../types");
exports.createEventValidator = [
    (0, express_validator_1.body)('title')
        .trim()
        .notEmpty()
        .withMessage('Title is required')
        .isLength({ min: 3, max: 150 })
        .withMessage('Title must be between 3 and 150 characters'),
    (0, express_validator_1.body)('description')
        .trim()
        .notEmpty()
        .withMessage('Description is required'),
    (0, express_validator_1.body)('category')
        .trim()
        .notEmpty()
        .withMessage('Category is required (e.g. Tech, Music, Sports)'),
    (0, express_validator_1.body)('venue')
        .trim()
        .notEmpty()
        .withMessage('Venue is required'),
    (0, express_validator_1.body)('startDate')
        .notEmpty()
        .withMessage('Start Date is required')
        .isISO8601()
        .withMessage('Start Date must be a valid ISO8601 date string'),
    (0, express_validator_1.body)('endDate')
        .notEmpty()
        .withMessage('End Date is required')
        .isISO8601()
        .withMessage('End Date must be a valid ISO8601 date string')
        .custom((endDate, { req }) => {
        if (new Date(endDate) <= new Date(req.body.startDate)) {
            throw new Error('End date must be after start date');
        }
        return true;
    }),
    (0, express_validator_1.body)('status')
        .optional()
        .isIn([types_1.EventStatus.DRAFT, types_1.EventStatus.PUBLISHED, types_1.EventStatus.CANCELLED, types_1.EventStatus.COMPLETED])
        .withMessage('Invalid event status'),
    (0, express_validator_1.body)('ticketTypes')
        .optional()
        .isArray({ min: 1 })
        .withMessage('ticketTypes must be an array with at least one ticket tier'),
    (0, express_validator_1.body)('ticketTypes.*.name')
        .trim()
        .notEmpty()
        .withMessage('Ticket type name is required'),
    (0, express_validator_1.body)('ticketTypes.*.price')
        .isFloat({ min: 0 })
        .withMessage('Ticket price must be a non-negative number'),
    (0, express_validator_1.body)('ticketTypes.*.capacity')
        .isInt({ min: 1 })
        .withMessage('Ticket capacity must be at least 1'),
];
exports.updateEventValidator = [
    (0, express_validator_1.param)('id').notEmpty().withMessage('Invalid Event ID format'),
    (0, express_validator_1.body)('title').optional().trim().isLength({ min: 3, max: 150 }),
    (0, express_validator_1.body)('description').optional().trim(),
    (0, express_validator_1.body)('category').optional().trim(),
    (0, express_validator_1.body)('venue').optional().trim(),
    (0, express_validator_1.body)('startDate').optional().isISO8601(),
    (0, express_validator_1.body)('endDate').optional().isISO8601(),
    (0, express_validator_1.body)('status')
        .optional()
        .isIn([types_1.EventStatus.DRAFT, types_1.EventStatus.PUBLISHED, types_1.EventStatus.CANCELLED, types_1.EventStatus.COMPLETED]),
];
exports.getEventsQueryValidator = [
    (0, express_validator_1.query)('page').optional().isInt({ min: 1 }).toInt(),
    (0, express_validator_1.query)('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
    (0, express_validator_1.query)('q').optional().trim(),
    (0, express_validator_1.query)('category').optional().trim(),
    (0, express_validator_1.query)('status').optional().trim(),
    (0, express_validator_1.query)('startDate').optional().isISO8601(),
    (0, express_validator_1.query)('endDate').optional().isISO8601(),
    (0, express_validator_1.query)('minPrice').optional().isFloat({ min: 0 }).toFloat(),
    (0, express_validator_1.query)('maxPrice').optional().isFloat({ min: 0 }).toFloat(),
    (0, express_validator_1.query)('sortBy').optional().isIn(['startDate', 'createdAt', 'title']),
    (0, express_validator_1.query)('order').optional().isIn(['asc', 'desc']),
];
exports.createTicketTypeValidator = [
    (0, express_validator_1.param)('eventId').notEmpty().withMessage('Invalid Event ID format'),
    (0, express_validator_1.body)('name').trim().notEmpty().withMessage('Ticket type name is required'),
    (0, express_validator_1.body)('price').isFloat({ min: 0 }).withMessage('Price must be a non-negative number'),
    (0, express_validator_1.body)('capacity').isInt({ min: 1 }).withMessage('Capacity must be at least 1'),
];
