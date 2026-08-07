"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = void 0;
const appError_1 = require("../utils/appError");
const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return next(new appError_1.AppError('Unauthorized access.', 401));
        }
        if (!allowedRoles.includes(req.user.role)) {
            return next(new appError_1.AppError(`Forbidden. Role '${req.user.role}' does not have permission to access this resource. Required: [${allowedRoles.join(', ')}]`, 403));
        }
        next();
    };
};
exports.authorize = authorize;
