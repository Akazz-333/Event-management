import { body, param } from 'express-validator';

export const createRegistrationValidator = [
  body('eventId').isUUID().withMessage('Valid eventId is required'),
  body('ticketTypeId').isUUID().withMessage('Valid ticketTypeId is required'),
];

export const checkInValidator = [
  body('ticketCode')
    .trim()
    .notEmpty()
    .withMessage('Ticket code is required for check-in'),
];

export const registrationIdParamValidator = [
  param('id').isUUID().withMessage('Invalid Registration ID format'),
];
