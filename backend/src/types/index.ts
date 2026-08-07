import { Request } from 'express';

export enum Role {
  ATTENDEE = 'ATTENDEE',
  ORGANIZER = 'ORGANIZER',
  ADMIN = 'ADMIN',
}

export enum EventStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
}

export enum RegistrationStatus {
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  ATTENDED = 'ATTENDED',
}

export interface JwtPayload {
  userId: string;
  email: string;
  role: Role;
}

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}
