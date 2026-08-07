import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types';
export declare const authenticate: (req: AuthenticatedRequest, res: Response, next: NextFunction) => void;
