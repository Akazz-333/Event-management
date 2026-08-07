export declare class AppError extends Error {
    statusCode: number;
    errors?: any[];
    isOperational: boolean;
    constructor(message: string, statusCode?: number, errors?: any[]);
}
