import { Request } from 'express';
export declare enum Role {
    ATTENDEE = "ATTENDEE",
    ORGANIZER = "ORGANIZER",
    ADMIN = "ADMIN"
}
export declare enum EventStatus {
    DRAFT = "DRAFT",
    PUBLISHED = "PUBLISHED",
    CANCELLED = "CANCELLED",
    COMPLETED = "COMPLETED"
}
export declare enum RegistrationStatus {
    CONFIRMED = "CONFIRMED",
    CANCELLED = "CANCELLED",
    ATTENDED = "ATTENDED"
}
export interface JwtPayload {
    userId: string;
    email: string;
    role: Role;
}
export interface AuthenticatedRequest extends Request {
    user?: JwtPayload;
}
