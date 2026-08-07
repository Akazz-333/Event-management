"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const routes_1 = __importDefault(require("./routes"));
const eventRoutes_1 = __importDefault(require("./routes/eventRoutes"));
const errorHandler_1 = require("./middleware/errorHandler");
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
// Health check endpoint
app.get('/api/v1/health', (req, res) => {
    res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});
// API Routes (Mounted on /api/v1, /v1, and / for serverless rewrite compatibility)
app.use('/api/v1', routes_1.default);
app.use('/v1', routes_1.default);
app.use('/events', eventRoutes_1.default);
// Global Error Handler
app.use(errorHandler_1.globalErrorHandler);
exports.default = app;
