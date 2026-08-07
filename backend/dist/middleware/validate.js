"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = void 0;
const express_validator_1 = require("express-validator");
const appError_1 = require("../utils/appError");
const validateRequest = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        const formattedErrors = errors.array().map((err) => ({
            field: err.path || err.param,
            message: err.msg,
        }));
        return next(new appError_1.AppError('Validation Failed', 400, formattedErrors));
    }
    next();
};
exports.validateRequest = validateRequest;
