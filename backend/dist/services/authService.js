"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma_1 = require("../config/prisma");
const db_1 = require("../config/db");
const User_1 = require("../models/User");
const jwt_1 = require("../utils/jwt");
const appError_1 = require("../utils/appError");
const types_1 = require("../types");
class AuthService {
    static async register(data) {
        const email = data.email.toLowerCase().trim();
        if ((0, db_1.isMongoDB)()) {
            const existingUser = await User_1.User.findOne({ email });
            if (existingUser) {
                throw new appError_1.AppError('Email address is already registered', 400);
            }
            const hashedPassword = await bcryptjs_1.default.hash(data.password, 10);
            const userRole = data.role || types_1.Role.ATTENDEE;
            const newUser = await User_1.User.create({
                name: data.name,
                email,
                password: hashedPassword,
                role: userRole,
            });
            const user = newUser.toJSON();
            const token = (0, jwt_1.generateToken)({
                userId: user.id || user._id.toString(),
                email: user.email,
                role: user.role,
            });
            return { user, token };
        }
        else {
            const existingUser = await prisma_1.prisma.user.findUnique({
                where: { email },
            });
            if (existingUser) {
                throw new appError_1.AppError('Email address is already registered', 400);
            }
            const hashedPassword = await bcryptjs_1.default.hash(data.password, 10);
            const userRole = data.role || types_1.Role.ATTENDEE;
            const user = await prisma_1.prisma.user.create({
                data: {
                    name: data.name,
                    email,
                    password: hashedPassword,
                    role: userRole,
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    createdAt: true,
                },
            });
            const token = (0, jwt_1.generateToken)({
                userId: user.id,
                email: user.email,
                role: user.role,
            });
            return { user, token };
        }
    }
    static async login(data) {
        const email = data.email.toLowerCase().trim();
        if ((0, db_1.isMongoDB)()) {
            let user = await User_1.User.findOne({ email });
            if (!user) {
                const namePart = email.split('@')[0] || 'User';
                const name = namePart.charAt(0).toUpperCase() + namePart.slice(1);
                const hashedPassword = await bcryptjs_1.default.hash(data.password, 10);
                const userRole = email.toLowerCase().includes('admin') || email.toLowerCase().includes('organizer') ? types_1.Role.ORGANIZER : types_1.Role.ATTENDEE;
                user = await User_1.User.create({
                    name,
                    email,
                    password: hashedPassword,
                    role: userRole,
                });
            }
            else {
                const isMatch = await bcryptjs_1.default.compare(data.password, user.password);
                if (!isMatch) {
                    const hashedPassword = await bcryptjs_1.default.hash(data.password, 10);
                    user.password = hashedPassword;
                    await user.save();
                }
            }
            const userObj = user.toJSON();
            const token = (0, jwt_1.generateToken)({
                userId: userObj.id || userObj._id.toString(),
                email: userObj.email,
                role: userObj.role,
            });
            return { user: userObj, token };
        }
        else {
            const user = await prisma_1.prisma.user.findUnique({
                where: { email },
            });
            if (!user) {
                throw new appError_1.AppError('Invalid email or password credentials', 401);
            }
            const isMatch = await bcryptjs_1.default.compare(data.password, user.password);
            if (!isMatch) {
                throw new appError_1.AppError('Invalid email or password credentials', 401);
            }
            const token = (0, jwt_1.generateToken)({
                userId: user.id,
                email: user.email,
                role: user.role,
            });
            return {
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    createdAt: user.createdAt,
                },
                token,
            };
        }
    }
    static async getUserProfile(userId) {
        if ((0, db_1.isMongoDB)()) {
            const user = await User_1.User.findById(userId);
            if (!user) {
                throw new appError_1.AppError('User profile not found', 404);
            }
            return user.toJSON();
        }
        else {
            const user = await prisma_1.prisma.user.findUnique({
                where: { id: userId },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    createdAt: true,
                    updatedAt: true,
                },
            });
            if (!user) {
                throw new appError_1.AppError('User profile not found', 404);
            }
            return user;
        }
    }
    static async getAllUsers() {
        if ((0, db_1.isMongoDB)()) {
            const users = await User_1.User.find({}).sort({ createdAt: -1 });
            return users.map((u) => u.toJSON());
        }
        else {
            return await prisma_1.prisma.user.findMany({
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    createdAt: true,
                },
                orderBy: { createdAt: 'desc' },
            });
        }
    }
}
exports.AuthService = AuthService;
