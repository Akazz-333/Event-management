"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const config_1 = require("./config");
const swagger_1 = require("./config/swagger");
const routes_1 = __importDefault(require("./routes"));
const errorHandler_1 = require("./middleware/errorHandler");
const appError_1 = require("./utils/appError");
const app = (0, express_1.default)();
// Security Middlewares with custom CSP for inline attributes support
app.use((0, helmet_1.default)({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            scriptSrcAttr: ["'unsafe-inline'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https:"],
            fontSrc: ["'self'", "https:", "data:"],
            imgSrc: ["'self'", "data:", "https:"],
        },
    },
}));
app.use((0, cors_1.default)({ origin: config_1.config.corsOrigin, credentials: true }));
// Rate Limiting
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 300, // limit each IP to 300 requests per windowMs
    message: {
        success: false,
        error: {
            message: 'Too many requests from this IP, please try again after 15 minutes.',
            statusCode: 429,
        },
    },
});
app.use('/api/', limiter);
// Body Parsing & Static Files
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.static('public'));
// Interactive Swagger API Documentation
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.swaggerSpec));
app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swagger_1.swaggerSpec);
});
// API Routes
app.use('/api/v1', routes_1.default);
// 404 Route Handler for unmatched routes
app.use('*', (req, res, next) => {
    next(new appError_1.AppError(`Cannot find endpoint ${req.originalUrl} on this server`, 404));
});
// Global Error Handler
app.use(errorHandler_1.globalErrorHandler);
exports.default = app;
