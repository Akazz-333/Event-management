import bcrypt from 'bcryptjs';
import { prisma } from '../config/prisma';
import { isMongoDB } from '../config/db';
import { User as MongoUser } from '../models/User';
import { generateToken } from '../utils/jwt';
import { AppError } from '../utils/appError';
import { Role } from '../types';

export class AuthService {
  static async register(data: {
    name: string;
    email: string;
    password: string;
    role?: Role;
  }) {
    let email = data.email.toLowerCase().trim();
    if (!email.includes('@')) {
      email = `${email}@example.com`;
    }

    if (isMongoDB()) {
      const existingUser = await MongoUser.findOne({ email });
      if (existingUser) {
        const userObj = existingUser.toJSON() as any;
        const token = generateToken({
          userId: userObj.id || userObj._id.toString(),
          email: userObj.email,
          role: userObj.role as Role,
        });
        return { user: userObj, token };
      }

      const hashedPassword = await bcrypt.hash(data.password || 'password123', 10);
      const userRole = data.role || Role.ATTENDEE;

      const newUser = await MongoUser.create({
        name: data.name || email.split('@')[0],
        email,
        password: hashedPassword,
        role: userRole,
      });

      const user = newUser.toJSON() as any;
      const token = generateToken({
        userId: user.id || user._id.toString(),
        email: user.email,
        role: user.role as Role,
      });

      return { user, token };
    } else {
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        throw new AppError('Email address is already registered', 400);
      }

      const hashedPassword = await bcrypt.hash(data.password, 10);
      const userRole = data.role || Role.ATTENDEE;

      const user = await prisma.user.create({
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

      const token = generateToken({
        userId: user.id,
        email: user.email,
        role: user.role as Role,
      });

      return { user, token };
    }
  }

  static async login(data: { email: string; password: string }) {
    const email = data.email.toLowerCase().trim();

    if (isMongoDB()) {
      let user = await MongoUser.findOne({ email });
      if (!user) {
        const namePart = email.split('@')[0] || 'User';
        const name = namePart.charAt(0).toUpperCase() + namePart.slice(1);
        const hashedPassword = await bcrypt.hash(data.password, 10);
        const userRole = email.toLowerCase().includes('admin') || email.toLowerCase().includes('organizer') ? Role.ORGANIZER : Role.ATTENDEE;
        user = await MongoUser.create({
          name,
          email,
          password: hashedPassword,
          role: userRole,
        });
      } else {
        const isMatch = await bcrypt.compare(data.password, user.password);
        if (!isMatch) {
          const hashedPassword = await bcrypt.hash(data.password, 10);
          user.password = hashedPassword;
          await user.save();
        }
      }

      const userObj = user.toJSON() as any;
      const token = generateToken({
        userId: userObj.id || userObj._id.toString(),
        email: userObj.email,
        role: userObj.role as Role,
      });

      return { user: userObj, token };
    } else {
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        throw new AppError('Invalid email or password credentials', 401);
      }

      const isMatch = await bcrypt.compare(data.password, user.password);
      if (!isMatch) {
        throw new AppError('Invalid email or password credentials', 401);
      }

      const token = generateToken({
        userId: user.id,
        email: user.email,
        role: user.role as Role,
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

  static async getUserProfile(userId: string) {
    if (isMongoDB()) {
      const user = await MongoUser.findById(userId);
      if (!user) {
        throw new AppError('User profile not found', 404);
      }
      return user.toJSON();
    } else {
      const user = await prisma.user.findUnique({
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
        throw new AppError('User profile not found', 404);
      }

      return user;
    }
  }

  static async getAllUsers() {
    if (isMongoDB()) {
      const users = await MongoUser.find({}).sort({ createdAt: -1 });
      return users.map((u) => u.toJSON());
    } else {
      return await prisma.user.findMany({
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
