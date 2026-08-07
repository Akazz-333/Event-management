import { EventStatus, Role } from '../types';
export interface CreateEventInput {
    title: string;
    description: string;
    category: string;
    venue: string;
    startDate: string;
    endDate: string;
    status?: EventStatus;
    ticketTypes?: {
        name: string;
        price: number;
        capacity: number;
    }[];
}
export interface UpdateEventInput {
    title?: string;
    description?: string;
    category?: string;
    venue?: string;
    startDate?: string;
    endDate?: string;
    status?: EventStatus;
}
export interface EventQueryParams {
    page?: number;
    limit?: number;
    q?: string;
    category?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: string;
    order?: 'asc' | 'desc';
}
export declare class EventService {
    static createEvent(organizerId: string, input: CreateEventInput): Promise<({
        ticketTypes: {
            name: string;
            createdAt: Date;
            id: string;
            price: number;
            capacity: number;
            eventId: string;
            updatedAt: Date;
            soldCount: number;
        }[];
        organizer: {
            name: string;
            email: string;
            id: string;
        };
    } & {
        category: string;
        startDate: Date;
        createdAt: Date;
        title: string;
        description: string;
        venue: string;
        endDate: Date;
        id: string;
        updatedAt: Date;
        status: string;
        organizerId: string;
    }) | {
        organizer: (import("../models/User").IUser & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        }) | null;
        ticketTypes: any[];
        title: string;
        description: string;
        category: string;
        venue: string;
        startDate: Date;
        endDate: Date;
        status: "DRAFT" | "PUBLISHED" | "CANCELLED" | "COMPLETED";
        organizerId: import("mongoose").Types.ObjectId;
        createdAt: Date;
        updatedAt: Date;
        _id: import("mongoose").Types.ObjectId;
        $locals: Record<string, unknown>;
        $op: "save" | "validate" | "remove" | null;
        $where: Record<string, unknown>;
        baseModelName?: string;
        collection: import("mongoose").Collection;
        db: import("mongoose").Connection;
        errors?: import("mongoose").Error.ValidationError;
        isNew: boolean;
        schema: import("mongoose").Schema;
        __v: number;
    }>;
    static getEvents(params: EventQueryParams): Promise<{
        events: any[];
        pagination: {
            page: number;
            limit: number;
            totalItems: number;
            totalPages: number;
            hasNext: boolean;
            hasPrev: boolean;
        };
    }>;
    static getEventById(eventId: string): Promise<any>;
    static updateEvent(eventId: string, userId: string, userRole: Role, input: UpdateEventInput): Promise<any>;
    static deleteEvent(eventId: string, userId: string, userRole: Role): Promise<{
        message: string;
    }>;
    static addTicketType(eventId: string, userId: string, userRole: Role, ticketData: {
        name: string;
        price: number;
        capacity: number;
    }): Promise<{
        name: string;
        createdAt: Date;
        id: string;
        price: number;
        capacity: number;
        eventId: string;
        updatedAt: Date;
        soldCount: number;
    } | (import("../models/TicketType").ITicketType & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })>;
    static getTicketTypesByEvent(eventId: string): Promise<{
        name: string;
        createdAt: Date;
        id: string;
        price: number;
        capacity: number;
        eventId: string;
        updatedAt: Date;
        soldCount: number;
    }[] | (import("../models/TicketType").ITicketType & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
}
