import request from 'supertest';
import app from '../src/app';
import { prisma } from '../src/config/prisma';
import { connectDB, isMongoDB } from '../src/config/db';
import { User as MongoUser } from '../src/models/User';
import { Event as MongoEvent } from '../src/models/Event';
import { TicketType as MongoTicketType } from '../src/models/TicketType';
import { Registration as MongoRegistration } from '../src/models/Registration';
import { Role } from '../src/types';

describe('Event Management REST API Integration Tests', () => {
  let attendeeToken: string;
  let organizerToken: string;
  let adminToken: string;
  let createdEventId: string;
  let createdTicketTypeId: string;
  let createdRegistrationId: string;
  let ticketCode: string;

  beforeAll(async () => {
    await connectDB();

    // Clear database before testing safely supporting MongoDB and SQLite
    if (isMongoDB()) {
      await MongoRegistration.deleteMany({});
      await MongoTicketType.deleteMany({});
      await MongoEvent.deleteMany({});
      await MongoUser.deleteMany({});
    } else {
      await prisma.registration.deleteMany();
      await prisma.ticketType.deleteMany();
      await prisma.event.deleteMany();
      await prisma.user.deleteMany();
    }
  });

  afterAll(async () => {
    if (!isMongoDB()) {
      await prisma.$disconnect();
    }
  });

  describe('1. General & System Endpoints', () => {
    it('GET / should return index.html frontend SPA', async () => {
      const res = await request(app).get('/');
      expect(res.status).toBe(200);
      expect(res.text).toContain('EventHub');
    });

    it('GET /api/v1/health should return UP status', async () => {
      const res = await request(app).get('/api/v1/health');
      expect(res.status).toBe(200);
      const status = res.body.data ? res.body.data.status : res.body.status;
      expect(status).toBe('UP');
    });

    it('GET /api/v1/postman-collection should return Postman JSON format', async () => {
      const res = await request(app).get('/api/v1/postman-collection');
      expect(res.status).toBe(200);
      expect(res.body.info).toBeDefined();
      expect(res.body.info.name).toContain('Event Management');
    });
  });

  describe('2. Authentication & Authorization', () => {
    it('POST /api/v1/auth/register - Register Attendee', async () => {
      const res = await request(app).post('/api/v1/auth/register').send({
        name: 'Attendee Alice',
        email: 'alice@test.com',
        password: 'Password123!',
        role: Role.ATTENDEE,
      });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBeDefined();
      expect(res.body.data.user.role).toBe(Role.ATTENDEE);

      attendeeToken = res.body.data.token;
    });

    it('POST /api/v1/auth/register - Register Organizer', async () => {
      const res = await request(app).post('/api/v1/auth/register').send({
        name: 'Organizer Bob',
        email: 'bob@test.com',
        password: 'Password123!',
        role: Role.ORGANIZER,
      });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBeDefined();
      expect(res.body.data.user.role).toBe(Role.ORGANIZER);

      organizerToken = res.body.data.token;
    });

    it('POST /api/v1/auth/register - Register Admin', async () => {
      const res = await request(app).post('/api/v1/auth/register').send({
        name: 'Admin Charlie',
        email: 'charlie@test.com',
        password: 'Password123!',
        role: Role.ADMIN,
      });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.role).toBe(Role.ADMIN);

      adminToken = res.body.data.token;
    });

    it('POST /api/v1/auth/login - Login existing user', async () => {
      const res = await request(app).post('/api/v1/auth/login').send({
        email: 'alice@test.com',
        password: 'Password123!',
      });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBeDefined();
    });

    it('GET /api/v1/auth/me - Retrieve current profile', async () => {
      const res = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', `Bearer ${attendeeToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.email).toBe('alice@test.com');
    });

    it('GET /api/v1/auth/me - Reject missing token with 401', async () => {
      const res = await request(app).get('/api/v1/auth/me');
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe('3. Events CRUD & Role Permissions', () => {
    it('POST /api/v1/events - Reject ATTENDEE role with 403 Forbidden', async () => {
      const res = await request(app)
        .post('/api/v1/events')
        .set('Authorization', `Bearer ${attendeeToken}`)
        .send({
          title: 'Forbidden Event',
          description: 'Testing RBAC restriction for attendees',
          category: 'Technology',
          venue: 'Main Auditorium',
          startDate: new Date('2026-10-01T10:00:00Z').toISOString(),
          endDate: new Date('2026-10-01T18:00:00Z').toISOString(),
        });

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });

    it('POST /api/v1/events - Allow ORGANIZER to create event', async () => {
      const res = await request(app)
        .post('/api/v1/events')
        .set('Authorization', `Bearer ${organizerToken}`)
        .send({
          title: 'Tech Summit 2026',
          description: 'Annual Artificial Intelligence and Software Conference',
          category: 'Technology',
          venue: 'Convention Center',
          startDate: new Date('2026-10-15T09:00:00Z').toISOString(),
          endDate: new Date('2026-10-17T17:00:00Z').toISOString(),
          ticketTypes: [
            { name: 'General Pass', price: 99.99, capacity: 100 },
            { name: 'VIP Pass', price: 299.99, capacity: 20 },
          ],
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBeDefined();

      createdEventId = res.body.data.id;
      createdTicketTypeId = res.body.data.ticketTypes[0].id;
    });

    it('GET /api/v1/events - List events with search and pagination metadata', async () => {
      const res = await request(app).get('/api/v1/events?q=Tech&page=1&limit=10');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.pagination).toBeDefined();
      expect(res.body.pagination.totalItems).toBeGreaterThanOrEqual(1);
    });

    it('GET /api/v1/events/:id - Get specific event details', async () => {
      const res = await request(app).get(`/api/v1/events/${createdEventId}`);

      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe(createdEventId);
      expect(res.body.data.ticketTypes.length).toBe(2);
    });

    it('PUT /api/v1/events/:id - Update event details', async () => {
      const res = await request(app)
        .put(`/api/v1/events/${createdEventId}`)
        .set('Authorization', `Bearer ${organizerToken}`)
        .send({
          title: 'Tech Summit 2026 (Updated)',
          venue: 'Grand Exhibition Hall',
        });

      expect(res.status).toBe(200);
      expect(res.body.data.title).toBe('Tech Summit 2026 (Updated)');
      expect(res.body.data.venue).toBe('Grand Exhibition Hall');
    });
  });

  describe('4. Ticket Registration & Concurrency Control', () => {
    it('POST /api/v1/registrations - Register ticket for Attendee', async () => {
      const res = await request(app)
        .post('/api/v1/registrations')
        .set('Authorization', `Bearer ${attendeeToken}`)
        .send({
          eventId: createdEventId,
          ticketTypeId: createdTicketTypeId,
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.ticketCode).toBeDefined();
      expect(res.body.data.qrCodeUrl).toContain('data:image/png;base64');

      createdRegistrationId = res.body.data.id;
      ticketCode = res.body.data.ticketCode;
    });

    it('POST /api/v1/registrations - Reject duplicate active registration for same user', async () => {
      const res = await request(app)
        .post('/api/v1/registrations')
        .set('Authorization', `Bearer ${attendeeToken}`)
        .send({
          eventId: createdEventId,
          ticketTypeId: createdTicketTypeId,
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.message).toContain('already registered');
    });

    it('GET /api/v1/registrations/my-tickets - List user tickets', async () => {
      const res = await request(app)
        .get('/api/v1/registrations/my-tickets')
        .set('Authorization', `Bearer ${attendeeToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].ticketCode).toBe(ticketCode);
    });

    it('GET /api/v1/registrations/:id - Fetch single ticket with QR Code', async () => {
      const res = await request(app)
        .get(`/api/v1/registrations/${createdRegistrationId}`)
        .set('Authorization', `Bearer ${attendeeToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe(createdRegistrationId);
      expect(res.body.data.qrCodeUrl).toBeDefined();
    });
  });

  describe('5. Venue Check-In & Verification', () => {
    it('POST /api/v1/registrations/check-in - Reject check-in from non-organizer (403)', async () => {
      const res = await request(app)
        .post('/api/v1/registrations/check-in')
        .set('Authorization', `Bearer ${attendeeToken}`)
        .send({ ticketCode });

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });

    it('POST /api/v1/registrations/check-in - Successful check-in by Event Organizer', async () => {
      const res = await request(app)
        .post('/api/v1/registrations/check-in')
        .set('Authorization', `Bearer ${organizerToken}`)
        .send({ ticketCode });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('ATTENDED');
      expect(res.body.data.checkedInAt).toBeDefined();
    });

    it('POST /api/v1/registrations/check-in - Reject repeated check-in attempt', async () => {
      const res = await request(app)
        .post('/api/v1/registrations/check-in')
        .set('Authorization', `Bearer ${organizerToken}`)
        .send({ ticketCode });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.message).toContain('already checked in');
    });
  });

  describe('6. Error Handling & Edge Cases', () => {
    it('404 for unknown endpoint', async () => {
      const res = await request(app).get('/api/v1/non-existent-route');
      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });

    it('400 Validation Error for missing body fields', async () => {
      const res = await request(app).post('/api/v1/auth/register').send({
        email: 'incomplete@test.com',
      });
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });
});
