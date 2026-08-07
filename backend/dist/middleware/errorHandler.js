"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = void 0;
const config_1 = require("../config");
const globalErrorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';
    let errors = err.errors || undefined;
    // Handle Prisma Specific Errors
    if (err.code === 'P2002') {
        statusCode = 409;
        message = 'Resource Conflict: A unique constraint violation occurred.';
    }
    else if (err.code === 'P2025') {
        statusCode = 404;
        message = 'Requested resource was not found.';
    }
    const responseBody = {
        success: false,
        error: {
            message,
            statusCode,
            ...(errors ? { errors } : {}),
            ...(config_1.config.nodeEnv === 'development' ? { stack: err.stack } : {}),
        },
    };
    return res.status(statusCode).json(responseBody);
};
exports.globalErrorHandler = globalErrorHandler;
