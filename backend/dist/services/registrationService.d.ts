import { Role } from '../types';
export declare class RegistrationService {
    private static generateUniqueTicketCode;
    static registerForEvent(userId: string, eventId: string, ticketTypeId: string): Promise<any>;
    static getUserRegistrations(userId: string): Promise<any[]>;
    static getRegistrationById(registrationId: string, userId: string, userRole: Role): Promise<any>;
    static cancelRegistration(registrationId: string, userId: string, userRole: Role): Promise<(import("../models/Registration").IRegistration & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }) | {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        eventId: string;
        ticketCode: string;
        checkedInAt: Date | null;
        userId: string;
        ticketTypeId: string;
    }>;
    static checkInAttendee(ticketCode: string, userId: string, userRole: Role): Promise<any>;
}
