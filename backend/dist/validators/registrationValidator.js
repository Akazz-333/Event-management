"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registrationIdParamValidator = exports.checkInValidator = exports.createRegistrationValidator = void 0;
const express_validator_1 = require("express-validator");
exports.createRegistrationValidator = [
    (0, express_validator_1.body)('eventId').notEmpty().withMessage('Valid eventId is required'),
    (0, express_validator_1.body)('ticketTypeId').notEmpty().withMessage('Valid ticketTypeId is required'),
];
exports.checkInValidator = [
    (0, express_validator_1.body)('ticketCode')
        .trim()
        .notEmpty()
        .withMessage('Ticket code is required for check-in'),
];
exports.registrationIdParamValidator = [
    (0, express_validator_1.param)('id').notEmpty().withMessage('Invalid Registration ID format'),
];
