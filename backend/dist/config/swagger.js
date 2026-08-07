"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerSpec = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
exports.swaggerSpec = (0, swagger_jsdoc_1.default)({
    definition: {
        openapi: '3.0.3',
        info: {
            title: 'EventHub Event Management REST API',
            version: '1.0.0',
            description: `
### 🎟️ EventHub RESTful API Documentation

A production-grade, multi-tenant **Event Management REST API & Digital Ticketing Platform** supporting MongoDB & SQLite.

#### Key Features:
- **Authentication & RBAC**: JWT Bearer token authentication with 3 role tiers (\`ATTENDEE\`, \`ORGANIZER\`, \`ADMIN\`).
- **Events Engine & Details View**: Full CRUD, multi-criteria full-text search (\`q\`), category filtering, date ranges, price filters, comprehensive single-event details page views, and standardized pagination metadata.
- **Ticket Tiering & Capacities**: Dynamic multi-tier pricing (*General Pass*, *VIP*, *Early Bird*), atomic capacity tracking, and ticket code generation.
- **Digital QR Tickets**: Base64 **QR Code Data URL** generation embedded into tickets for instant entrance verification.
- **Venue Entrance Check-In**: High-throughput ticket validation (\`POST /api/v1/registrations/check-in\`) for event organizers.
- **MongoDB & SQLite Dual Engine**: Native support for MongoDB Atlas / MongoDB Compass and SQLite databases.
      `,
            contact: {
                name: 'EventHub Engineering Team',
                email: 'api-support@eventhub.com',
            },
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Local Development Server',
            },
        ],
        components: {
            securitySchemes: {
                BearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Provide your JWT token in the header format: `Bearer <token>`',
                },
            },
            schemas: {
                User: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', example: '6a758a833818fdf1d32b087c' },
                        name: { type: 'string', example: 'Alex Morgan' },
                        email: { type: 'string', example: 'alex@example.com' },
                        role: { type: 'string', enum: ['ATTENDEE', 'ORGANIZER', 'ADMIN'], example: 'ATTENDEE' },
                        createdAt: { type: 'string', format: 'date-time', example: '2026-08-07T12:00:00.000Z' },
                    },
                },
                TicketType: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', example: '6a758a833818fdf1d32b088f' },
                        name: { type: 'string', example: 'VIP Access Pass' },
                        price: { type: 'number', example: 149.99 },
                        capacity: { type: 'integer', example: 100 },
                        soldCount: { type: 'integer', example: 12 },
                    },
                },
                Event: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', example: '6a758a833818fdf1d32b0880' },
                        title: { type: 'string', example: 'Global AI & Deep Learning Summit 2026' },
                        description: { type: 'string', example: 'Explore state-of-the-art breakthroughs in generative AI and LLMs.' },
                        category: { type: 'string', example: 'Technology' },
                        venue: { type: 'string', example: 'San Francisco Convention Center' },
                        startDate: { type: 'string', format: 'date-time', example: '2026-09-15T09:00:00.000Z' },
                        endDate: { type: 'string', format: 'date-time', example: '2026-09-17T18:00:00.000Z' },
                        status: { type: 'string', enum: ['DRAFT', 'PUBLISHED', 'CANCELLED', 'COMPLETED'], example: 'PUBLISHED' },
                        organizer: { $ref: '#/components/schemas/User' },
                        ticketTypes: { type: 'array', items: { $ref: '#/components/schemas/TicketType' } },
                    },
                },
                Registration: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', example: '6a758a833818fdf1d32b0890' },
                        ticketCode: { type: 'string', example: 'EVT-TKT-A9X2M1' },
                        status: { type: 'string', enum: ['CONFIRMED', 'CANCELLED', 'ATTENDED'], example: 'CONFIRMED' },
                        qrCodeUrl: { type: 'string', example: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...' },
                        event: { $ref: '#/components/schemas/Event' },
                        ticketType: { $ref: '#/components/schemas/TicketType' },
                        checkedInAt: { type: 'string', format: 'date-time', nullable: true },
                    },
                },
                ErrorResponse: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', example: false },
                        error: {
                            type: 'object',
                            properties: {
                                message: { type: 'string', example: 'Validation Failed or Resource Not Found' },
                                statusCode: { type: 'integer', example: 400 },
                                errors: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            field: { type: 'string', example: 'email' },
                                            message: { type: 'string', example: 'Invalid email address format' },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        security: [
            {
                BearerAuth: [],
            },
        ],
        paths: {
            '/api/v1/auth/register': {
                post: {
                    tags: ['Authentication'],
                    summary: 'Register a new user account',
                    description: 'Creates a new user profile (`ATTENDEE`, `ORGANIZER`, or `ADMIN`) and returns a signed JWT token.',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['name', 'email', 'password'],
                                    properties: {
                                        name: { type: 'string', example: 'Alex Morgan' },
                                        email: { type: 'string', example: 'alex@example.com' },
                                        password: { type: 'string', example: 'password123' },
                                        role: { type: 'string', enum: ['ATTENDEE', 'ORGANIZER', 'ADMIN'], example: 'ATTENDEE' },
                                    },
                                },
                            },
                        },
                    },
                    responses: {
                        '201': {
                            description: 'User registered successfully',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            success: { type: 'boolean', example: true },
                                            message: { type: 'string', example: 'User registered successfully' },
                                            data: {
                                                type: 'object',
                                                properties: {
                                                    user: { $ref: '#/components/schemas/User' },
                                                    token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsIn...' },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                        '400': { $ref: '#/components/schemas/ErrorResponse' },
                    },
                },
            },
            '/api/v1/auth/login': {
                post: {
                    tags: ['Authentication'],
                    summary: 'Sign in to existing account',
                    description: 'Authenticates email and password credentials and issues a JWT token.',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['email', 'password'],
                                    properties: {
                                        email: { type: 'string', example: 'alex@example.com' },
                                        password: { type: 'string', example: 'password123' },
                                    },
                                },
                            },
                        },
                    },
                    responses: {
                        '200': { description: 'Authenticated successfully' },
                        '401': { description: 'Invalid email or password' },
                    },
                },
            },
            '/api/v1/auth/me': {
                get: {
                    tags: ['Authentication'],
                    summary: 'Retrieve authenticated user profile',
                    security: [{ BearerAuth: [] }],
                    responses: {
                        '200': { description: 'User profile object' },
                        '401': { description: 'Unauthorized - Missing or invalid Bearer token' },
                    },
                },
            },
            '/api/v1/events': {
                get: {
                    tags: ['Events Catalog'],
                    summary: 'List events with search, filters, and pagination',
                    description: 'Retrieve a paginated list of published events with multi-criteria search, category filters, and date range filters.',
                    parameters: [
                        { in: 'query', name: 'q', schema: { type: 'string' }, description: 'Full-text search keyword for title, venue, category, or description' },
                        { in: 'query', name: 'category', schema: { type: 'string' }, description: 'Filter by category (e.g. Technology, Music, Business, Sports, Design)' },
                        { in: 'query', name: 'page', schema: { type: 'integer', default: 1 }, description: 'Page number' },
                        { in: 'query', name: 'limit', schema: { type: 'integer', default: 10 }, description: 'Number of items per page' },
                        { in: 'query', name: 'sortBy', schema: { type: 'string', enum: ['startDate', 'createdAt', 'title'] }, description: 'Field name to sort by' },
                        { in: 'query', name: 'order', schema: { type: 'string', enum: ['asc', 'desc'] }, description: 'Sort direction' },
                    ],
                    responses: {
                        '200': { description: 'Paginated list of events with metadata' },
                    },
                },
                post: {
                    tags: ['Events Catalog'],
                    summary: 'Create and publish a new event',
                    description: 'Requires `ORGANIZER` or `ADMIN` role. Creates an event listing with optional initial ticket tiers.',
                    security: [{ BearerAuth: [] }],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['title', 'description', 'category', 'venue', 'startDate', 'endDate'],
                                    properties: {
                                        title: { type: 'string', example: 'Global AI & Deep Learning Summit 2026' },
                                        description: { type: 'string', example: 'Explore state-of-the-art breakthroughs in generative AI and LLMs.' },
                                        category: { type: 'string', example: 'Technology' },
                                        venue: { type: 'string', example: 'San Francisco Convention Center' },
                                        startDate: { type: 'string', format: 'date-time', example: '2026-09-15T09:00:00.000Z' },
                                        endDate: { type: 'string', format: 'date-time', example: '2026-09-17T18:00:00.000Z' },
                                        ticketTypes: {
                                            type: 'array',
                                            items: {
                                                type: 'object',
                                                properties: {
                                                    name: { type: 'string', example: 'General Pass' },
                                                    price: { type: 'number', example: 49.99 },
                                                    capacity: { type: 'integer', example: 100 },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    responses: {
                        '201': { description: 'Event published successfully' },
                        '403': { description: 'Forbidden - Requires ORGANIZER or ADMIN role' },
                    },
                },
            },
            '/api/v1/events/{id}': {
                get: {
                    tags: ['Events Catalog'],
                    summary: 'Get details of a specific event (Event Details Page View)',
                    description: 'Retrieves comprehensive details for a single event including full description, schedule, venue location, organizer profile, and ticket pass pricing.',
                    parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
                    responses: {
                        '200': {
                            description: 'Detailed event record with ticket tiers and organizer profile',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            success: { type: 'boolean', example: true },
                                            data: { $ref: '#/components/schemas/Event' },
                                        },
                                    },
                                },
                            },
                        },
                        '404': { description: 'Event not found' },
                    },
                },
                put: {
                    tags: ['Events Catalog'],
                    summary: 'Update event details',
                    security: [{ BearerAuth: [] }],
                    parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
                    requestBody: {
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        title: { type: 'string' },
                                        venue: { type: 'string' },
                                        category: { type: 'string' },
                                        status: { type: 'string', enum: ['DRAFT', 'PUBLISHED', 'CANCELLED', 'COMPLETED'] },
                                    },
                                },
                            },
                        },
                    },
                    responses: {
                        '200': { description: 'Event record updated' },
                        '403': { description: 'Permission denied - Must be event organizer or admin' },
                    },
                },
                delete: {
                    tags: ['Events Catalog'],
                    summary: 'Delete an event listing',
                    security: [{ BearerAuth: [] }],
                    parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
                    responses: {
                        '200': { description: 'Event and associated ticket tiers removed' },
                    },
                },
            },
            '/api/v1/events/{id}/ticket-types': {
                post: {
                    tags: ['Events Catalog'],
                    summary: 'Add a new ticket tier to an existing event',
                    security: [{ BearerAuth: [] }],
                    parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['name', 'price', 'capacity'],
                                    properties: {
                                        name: { type: 'string', example: 'VIP Lounge Pass' },
                                        price: { type: 'number', example: 199.99 },
                                        capacity: { type: 'integer', example: 50 },
                                    },
                                },
                            },
                        },
                    },
                    responses: {
                        '201': { description: 'Ticket tier created' },
                    },
                },
            },
            '/api/v1/registrations': {
                post: {
                    tags: ['Registrations & Digital Wallet'],
                    summary: 'Book a ticket pass for an event',
                    description: 'Reserves a ticket pass, decrements remaining tier capacity atomically, generates a unique ticket code and embedded QR Code Data URL.',
                    security: [{ BearerAuth: [] }],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['eventId', 'ticketTypeId'],
                                    properties: {
                                        eventId: { type: 'string', example: '6a758a833818fdf1d32b0880' },
                                        ticketTypeId: { type: 'string', example: '6a758a833818fdf1d32b088f' },
                                    },
                                },
                            },
                        },
                    },
                    responses: {
                        '201': { description: 'Ticket booked successfully with ticket code and base64 QR Code' },
                        '400': { description: 'Sold out or user already registered for event' },
                    },
                },
            },
            '/api/v1/registrations/my-tickets': {
                get: {
                    tags: ['Registrations & Digital Wallet'],
                    summary: 'List user digital ticket wallet',
                    description: 'Retrieves all event tickets registered by the authenticated user with status badges and QR Codes.',
                    security: [{ BearerAuth: [] }],
                    responses: {
                        '200': { description: 'Array of user ticket objects' },
                    },
                },
            },
            '/api/v1/registrations/{id}': {
                get: {
                    tags: ['Registrations & Digital Wallet'],
                    summary: 'Get single ticket pass details',
                    security: [{ BearerAuth: [] }],
                    parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
                    responses: {
                        '200': { description: 'Ticket details object with embedded QR Code' },
                        '403': { description: 'Access denied' },
                    },
                },
            },
            '/api/v1/registrations/{id}/cancel': {
                post: {
                    tags: ['Registrations & Digital Wallet'],
                    summary: 'Cancel ticket registration',
                    security: [{ BearerAuth: [] }],
                    parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
                    responses: {
                        '200': { description: 'Registration cancelled and ticket tier capacity incremented' },
                    },
                },
            },
            '/api/v1/registrations/check-in': {
                post: {
                    tags: ['Venue Check-In Scanner'],
                    summary: 'Verify ticket code at venue entrance',
                    description: 'Requires `ORGANIZER` or `ADMIN` role. Validates an attendee ticket code, ensures ticket is active, and records attendance timestamp.',
                    security: [{ BearerAuth: [] }],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['ticketCode'],
                                    properties: {
                                        ticketCode: { type: 'string', example: 'EVT-TKT-A9X2M1' },
                                    },
                                },
                            },
                        },
                    },
                    responses: {
                        '200': { description: 'Ticket check-in verified successfully' },
                        '400': { description: 'Ticket code already checked-in or cancelled' },
                        '404': { description: 'Invalid ticket code' },
                    },
                },
            },
            '/api/v1/health': {
                get: {
                    tags: ['System Health'],
                    summary: 'Check API service health status',
                    responses: {
                        '200': { description: 'System health UP' },
                    },
                },
            },
            '/api/v1/postman-collection': {
                get: {
                    tags: ['System Health'],
                    summary: 'Export OpenAPI Postman collection JSON',
                    responses: {
                        '200': { description: 'Postman collection JSON payload' },
                    },
                },
            },
        },
    },
    apis: [],
});
