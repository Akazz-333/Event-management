"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const authService_1 = require("../services/authService");
const response_1 = require("../utils/response");
class AuthController {
    static async register(req, res, next) {
        try {
            let { name, email, password, role } = req.body || {};
            if (email && !email.includes('@')) {
                email = `${email.trim()}@example.com`;
            }
            if (!name && email) {
                name = email.split('@')[0];
            }
            const result = await authService_1.AuthService.register({ name, email, password, role });
            return (0, response_1.sendSuccess)(res, result, 'User registered successfully', 201);
        }
        catch (error) {
            next(error);
        }
    }
    static async login(req, res, next) {
        try {
            let { email, password } = req.body || {};
            if (email && !email.includes('@')) {
                email = `${email.trim()}@example.com`;
            }
            const result = await authService_1.AuthService.login({ email, password });
            return (0, response_1.sendSuccess)(res, result, 'User logged in successfully', 200);
        }
        catch (error) {
            next(error);
        }
    }
    static async me(req, res, next) {
        try {
            const userId = req.user.userId;
            const user = await authService_1.AuthService.getUserProfile(userId);
            return (0, response_1.sendSuccess)(res, user, 'Profile retrieved successfully', 200);
        }
        catch (error) {
            next(error);
        }
    }
    static async getUsers(req, res, next) {
        try {
            const users = await authService_1.AuthService.getAllUsers();
            return (0, response_1.sendSuccess)(res, users, 'Users retrieved successfully', 200);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.AuthController = AuthController;
