"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const registrationController_1 = require("../controllers/registrationController");
const registrationValidator_1 = require("../validators/registrationValidator");
const validate_1 = require("../middleware/validate");
const auth_1 = require("../middleware/auth");
const roles_1 = require("../middleware/roles");
const types_1 = require("../types");
const router = (0, express_1.Router)();
router.use(auth_1.authenticate);
router.post('/', registrationValidator_1.createRegistrationValidator, validate_1.validateRequest, registrationController_1.RegistrationController.register);
router.get('/my-tickets', registrationController_1.RegistrationController.getMyTickets);
router.get('/:id', registrationValidator_1.registrationIdParamValidator, validate_1.validateRequest, registrationController_1.RegistrationController.getTicketById);
router.post('/:id/cancel', registrationValidator_1.registrationIdParamValidator, validate_1.validateRequest, registrationController_1.RegistrationController.cancelRegistration);
// Check-in venue endpoint for Event Organizers and Admins
router.post('/check-in', (0, roles_1.authorize)(types_1.Role.ORGANIZER, types_1.Role.ADMIN), registrationValidator_1.checkInValidator, validate_1.validateRequest, registrationController_1.RegistrationController.checkIn);
exports.default = router;
