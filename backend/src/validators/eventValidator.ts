import { body, param, query } from 'express-validator';
import { EventStatus } from '../types';

export const createEventValidator = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 3, max: 150 })
    .withMessage('Title must be between 3 and 150 characters'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required'),
  body('category')
    .trim()
    .notEmpty()
    .withMessage('Category is required (e.g. Tech, Music, Sports)'),
  body('venue')
    .trim()
    .notEmpty()
    .withMessage('Venue is required'),
  body('startDate')
    .notEmpty()
    .withMessage('Start Date is required')
    .isISO8601()
    .withMessage('Start Date must be a valid ISO8601 date string'),
  body('endDate')
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
  body('status')
    .optional()
    .isIn([EventStatus.DRAFT, EventStatus.PUBLISHED, EventStatus.CANCELLED, EventStatus.COMPLETED])
    .withMessage('Invalid event status'),
  body('ticketTypes')
    .optional()
    .isArray({ min: 1 })
    .withMessage('ticketTypes must be an array with at least one ticket tier'),
  body('ticketTypes.*.name')
    .trim()
    .notEmpty()
    .withMessage('Ticket type name is required'),
  body('ticketTypes.*.price')
    .isFloat({ min: 0 })
    .withMessage('Ticket price must be a non-negative number'),
  body('ticketTypes.*.capacity')
    .isInt({ min: 1 })
    .withMessage('Ticket capacity must be at least 1'),
];

export const updateEventValidator = [
  param('id').isUUID().withMessage('Invalid Event ID format'),
  body('title').optional().trim().isLength({ min: 3, max: 150 }),
  body('description').optional().trim(),
  body('category').optional().trim(),
  body('venue').optional().trim(),
  body('startDate').optional().isISO8601(),
  body('endDate').optional().isISO8601(),
  body('status')
    .optional()
    .isIn([EventStatus.DRAFT, EventStatus.PUBLISHED, EventStatus.CANCELLED, EventStatus.COMPLETED]),
];

export const getEventsQueryValidator = [
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
  query('q').optional().trim(),
  query('category').optional().trim(),
  query('status').optional().trim(),
  query('startDate').optional().isISO8601(),
  query('endDate').optional().isISO8601(),
  query('minPrice').optional().isFloat({ min: 0 }).toFloat(),
  query('maxPrice').optional().isFloat({ min: 0 }).toFloat(),
  query('sortBy').optional().isIn(['startDate', 'createdAt', 'title']),
  query('order').optional().isIn(['asc', 'desc']),
];

export const createTicketTypeValidator = [
  param('eventId').isUUID().withMessage('Invalid Event ID format'),
  body('name').trim().notEmpty().withMessage('Ticket type name is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a non-negative number'),
  body('capacity').isInt({ min: 1 }).withMessage('Capacity must be at least 1'),
];
