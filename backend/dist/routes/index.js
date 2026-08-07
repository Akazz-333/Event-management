"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authRoutes_1 = __importDefault(require("./authRoutes"));
const eventRoutes_1 = __importDefault(require("./eventRoutes"));
const registrationRoutes_1 = __importDefault(require("./registrationRoutes"));
const collection_1 = require("../postman/collection");
const router = (0, express_1.Router)();
// Health Check
router.get('/health', (req, res) => {
    return res.status(200).json({
        status: 'UP',
        message: 'Event Management REST API is healthy and operational.',
        timestamp: new Date().toISOString(),
    });
});
// Dynamic Postman Collection Export Endpoint
router.get('/postman-collection', (req, res) => {
    const protocol = req.protocol;
    const host = req.get('host');
    const baseUrl = `${protocol}://${host}`;
    const collection = (0, collection_1.getPostmanCollection)(baseUrl);
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename="event_management_api.postman_collection.json"');
    return res.status(200).json(collection);
});
// Mount Resource Routes
router.use('/auth', authRoutes_1.default);
router.use('/events', eventRoutes_1.default);
router.use('/registrations', registrationRoutes_1.default);
exports.default = router;
