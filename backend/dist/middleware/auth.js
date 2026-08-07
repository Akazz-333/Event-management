"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jwt_1 = require("../utils/jwt");
const appError_1 = require("../utils/appError");
const authenticate = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new appError_1.AppError('Authentication required. Missing Bearer token.', 401);
        }
        const token = authHeader.split(' ')[1];
        if (!token) {
            throw new appError_1.AppError('Authentication failed. Empty token provided.', 401);
        }
        const decoded = (0, jwt_1.verifyToken)(token);
        req.user = decoded;
        next();
    }
    catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return next(new appError_1.AppError('Invalid token signature.', 401));
        }
        if (error.name === 'TokenExpiredError') {
            return next(new appError_1.AppError('Token has expired. Please log in again.', 401));
        }
        next(error);
    }
};
exports.authenticate = authenticate;
