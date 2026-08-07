import request from 'supertest';
import app from '../src/app';
import { prisma } from '../src/config/prisma';

describe('Event Management REST API Integration Tests', () => {
  let attendeeToken: string;
  let organizerToken: string;
  let adminToken: string;

  let organizerId: string;
  let createdEventId: string;
  let createdTicketTypeId: string;
  let registeredTicketCode: string;
  let registrationId: string;

  beforeAll(async () => {
    // Clear database before testing
    await prisma.registration.deleteMany();
    await prisma.ticketType.deleteMany();
    await prisma.event.deleteMany();
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
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
      expect(res.body.status).toBe('UP');
    });

    it('GET /api/v1/postman-collection should return Postman JSON format', async () => {
      const res = await request(app).get('/api/v1/postman-collection');
      expect(res.status).toBe(200);
      expect(res.body.info.name).toContain('Event Management');
      expect(res.body.item.length).toBeGreaterThan(0);
    });
  });

  describe('2. Authentication & Authorization', () => {
    it('POST /api/v1/auth/register - Register Attendee', async () => {
      const res = await request(app).post('/api/v1/auth/register').send({
        name: 'User Attendee',
        email: 'attendee@test.com',
        password: 'password123',
        role: 'ATTENDEE',
      });
      expect(res.status).toBe(201);
      expect(res.body.data.user.email).toBe('attendee@test.com');
      expect(res.body.data.token).toBeDefined();
      attendeeToken = res.body.data.token;
    });

    it('POST /api/v1/auth/register - Register Organizer', async () => {
      const res = await request(app).post('/api/v1/auth/register').send({
        name: 'Organizer Alex',
        email: 'organizer@test.com',
        password: 'password123',
        role: 'ORGANIZER',
      });
      expect(res.status).toBe(201);
      expect(res.body.data.token).toBeDefined();
      organizerToken = res.body.data.token;
      organizerId = res.body.data.user.id;
    });

    it('POST /api/v1/auth/register - Register Admin', async () => {
      const res = await request(app).post('/api/v1/auth/register').send({
        name: 'Super Admin',
        email: 'admin@test.com',
        password: 'password123',
        role: 'ADMIN',
      });
      expect(res.status).toBe(201);
      adminToken = res.body.data.token;
    });

    it('POST /api/v1/auth/login - Login existing user', async () => {
      const res = await request(app).post('/api/v1/auth/login').send({
        email: 'attendee@test.com',
        password: 'password123',
      });
      expect(res.status).toBe(200);
      expect(res.body.data.token).toBeDefined();
    });

    it('GET /api/v1/auth/me - Retrieve current profile', async () => {
      const res = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', `Bearer ${attendeeToken}`);
      expect(res.status).toBe(200);
      expect(res.body.data.email).toBe('attendee@test.com');
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
          title: 'Unauthorized Event',
          description: 'Testing RBAC',
          category: 'Tech',
          venue: 'Venue 1',
          startDate: '2026-10-01T09:00:00Z',
          endDate: '2026-10-01T17:00:00Z',
        });
      expect(res.status).toBe(403);
    });

    it('POST /api/v1/events - Allow ORGANIZER to create event', async () => {
      const res = await request(app)
        .post('/api/v1/events')
        .set('Authorization', `Bearer ${organizerToken}`)
        .send({
          title: 'Cloud & AI Developer Conference',
          description: 'Annual gathering for tech enthusiasts and developers.',
          category: 'Technology',
          venue: 'Grand Tech Convention Center',
          startDate: '2026-11-10T09:00:00.000Z',
          endDate: '2026-11-12T17:00:00.000Z',
          ticketTypes: [
            { name: 'Standard Pass', price: 99.0, capacity: 2 },
            { name: 'VIP Pass', price: 299.0, capacity: 10 },
          ],
        });
      expect(res.status).toBe(201);
      expect(res.body.data.title).toBe('Cloud & AI Developer Conference');
      expect(res.body.data.ticketTypes.length).toBe(2);
      createdEventId = res.body.data.id;
      createdTicketTypeId = res.body.data.ticketTypes[0].id;
    });

    it('GET /api/v1/events - List events with search and pagination metadata', async () => {
      const res = await request(app)
        .get('/api/v1/events?q=Developer&page=1&limit=10');
      expect(res.status).toBe(200);
      expect(res.body.data.length).toBeGreaterThan(0);
      expect(res.body.pagination).toBeDefined();
      expect(res.body.pagination.totalItems).toBe(1);
    });

    it('GET /api/v1/events/:id - Get specific event details', async () => {
      const res = await request(app).get(`/api/v1/events/${createdEventId}`);
      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe(createdEventId);
    });

    it('PUT /api/v1/events/:id - Update event details', async () => {
      const res = await request(app)
        .put(`/api/v1/events/${createdEventId}`)
        .set('Authorization', `Bearer ${organizerToken}`)
        .send({
          venue: 'Updated Tech Center, San Jose, CA',
        });
      expect(res.status).toBe(200);
      expect(res.body.data.venue).toBe('Updated Tech Center, San Jose, CA');
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
      expect(res.body.data.ticketCode).toBeDefined();
      expect(res.body.data.qrCodeUrl).toContain('data:image/png;base64');
      registeredTicketCode = res.body.data.ticketCode;
      registrationId = res.body.data.id;
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
      expect(res.body.error.message).toContain('already registered');
    });

    it('GET /api/v1/registrations/my-tickets - List user tickets', async () => {
      const res = await request(app)
        .get('/api/v1/registrations/my-tickets')
        .set('Authorization', `Bearer ${attendeeToken}`);
      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].ticketCode).toBe(registeredTicketCode);
    });

    it('GET /api/v1/registrations/:id - Fetch single ticket with QR Code', async () => {
      const res = await request(app)
        .get(`/api/v1/registrations/${registrationId}`)
        .set('Authorization', `Bearer ${attendeeToken}`);
      expect(res.status).toBe(200);
      expect(res.body.data.ticketCode).toBe(registeredTicketCode);
    });
  });

  describe('5. Venue Check-In & Verification', () => {
    it('POST /api/v1/registrations/check-in - Reject check-in from non-organizer (403)', async () => {
      const res = await request(app)
        .post('/api/v1/registrations/check-in')
        .set('Authorization', `Bearer ${attendeeToken}`)
        .send({ ticketCode: registeredTicketCode });
      expect(res.status).toBe(403);
    });

    it('POST /api/v1/registrations/check-in - Successful check-in by Event Organizer', async () => {
      const res = await request(app)
        .post('/api/v1/registrations/check-in')
        .set('Authorization', `Bearer ${organizerToken}`)
        .send({ ticketCode: registeredTicketCode });
      expect(res.status).toBe(200);
      expect(res.body.data.status).toBe('ATTENDED');
      expect(res.body.data.checkedInAt).toBeDefined();
    });

    it('POST /api/v1/registrations/check-in - Reject repeated check-in attempt', async () => {
      const res = await request(app)
        .post('/api/v1/registrations/check-in')
        .set('Authorization', `Bearer ${organizerToken}`)
        .send({ ticketCode: registeredTicketCode });
      expect(res.status).toBe(400);
      expect(res.body.error.message).toContain('already checked in');
    });
  });

  describe('6. Error Handling & Edge Cases', () => {
    it('404 for unknown endpoint', async () => {
      const res = await request(app).get('/api/v1/non-existent-path');
      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });

    it('400 Validation Error for missing body fields', async () => {
      const res = await request(app).post('/api/v1/auth/login').send({});
      expect(res.status).toBe(400);
      expect(res.body.error.errors).toBeDefined();
    });
  });
});
