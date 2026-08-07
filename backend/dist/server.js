"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const config_1 = require("./config");
const prisma_1 = require("./config/prisma");
const db_1 = require("./config/db");
const PORT = config_1.config.port;
const startServer = async () => {
    // Connect to database (MongoDB Mongoose or SQLite Prisma)
    await (0, db_1.connectDB)();
    if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
        const server = app_1.default.listen(PORT, () => {
            console.log(`=======================================================`);
            console.log(`🚀 Event Management REST API server running on port ${PORT}`);
            console.log(`📖 Swagger API Docs: http://localhost:3000/api-docs`);
            console.log(`📥 Postman Collection: http://localhost:3000/api/v1/postman-collection`);
            console.log(`=======================================================`);
        });
        const shutdown = async () => {
            console.log('Shutting down server gracefully...');
            server.close(async () => {
                await prisma_1.prisma.$disconnect();
                console.log('Database connection closed. Process exited.');
                process.exit(0);
            });
        };
        process.on('SIGINT', shutdown);
        process.on('SIGTERM', shutdown);
    }
};
startServer();
exports.default = app_1.default;
