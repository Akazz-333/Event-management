"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = void 0;
class AppError extends Error {
    statusCode;
    errors;
    isOperational;
    constructor(message, statusCode = 500, errors) {
        super(message);
        this.statusCode = statusCode;
        this.errors = errors;
        this.isOperational = true;
        Object.setPrototypeOf(this, new.target.prototype);
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
