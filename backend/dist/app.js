"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const routes_1 = __importDefault(require("./routes"));
const errorHandler_1 = require("./middleware/errorHandler");
const appError_1 = require("./utils/appError");
const app = (0, express_1.default)();
app.set('trust proxy', 1);
// Security Middlewares
app.use((0, helmet_1.default)({
    contentSecurityPolicy: false,
}));
app.use((0, cors_1.default)({ origin: '*', credentials: true }));
// Body Parsing & Static Files
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.static('public'));
// Dynamic Lazy Load Swagger Docs to prevent serverless bundling failure
app.get('/api-docs*', async (req, res, next) => {
    try {
        const swaggerUi = require('swagger-ui-express');
        const { swaggerSpec } = require('./config/swagger');
        return swaggerUi.serve[0](req, res, () => {
            swaggerUi.setup(swaggerSpec)(req, res, next);
        });
    }
    catch (e) {
        res.status(200).json({ message: 'Swagger API Docs available in local environment' });
    }
});
// Health check endpoint
app.get('/api/v1/health', (req, res) => {
    res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});
// API Routes
app.use('/api/v1', routes_1.default);
// 404 Route Handler for unmatched API routes
app.use('/api/*', (req, res, next) => {
    next(new appError_1.AppError(`Cannot find endpoint ${req.originalUrl} on this server`, 404));
});
// Global Error Handler
app.use(errorHandler_1.globalErrorHandler);
exports.default = app;
