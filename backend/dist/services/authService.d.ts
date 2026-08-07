import { Role } from '../types';
export declare class AuthService {
    static register(data: {
        name: string;
        email: string;
        password: string;
        role?: Role;
    }): Promise<{
        user: any;
        token: string;
    }>;
    static login(data: {
        email: string;
        password: string;
    }): Promise<{
        user: any;
        token: string;
    }>;
    static getUserProfile(userId: string): Promise<(import("../models/User").IUser & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }) | {
        id: string;
        name: string;
        email: string;
        role: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    static getAllUsers(): Promise<(import("../models/User").IUser & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[] | {
        id: string;
        name: string;
        email: string;
        role: string;
        createdAt: Date;
    }[]>;
}
