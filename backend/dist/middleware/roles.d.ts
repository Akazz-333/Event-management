import { Response, NextFunction } from 'express';
import { AuthenticatedRequest, Role } from '../types';
export declare const authorize: (...allowedRoles: Role[]) => (req: AuthenticatedRequest, res: Response, next: NextFunction) => void;
