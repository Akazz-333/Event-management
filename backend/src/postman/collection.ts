export const getPostmanCollection = (baseUrl: string = 'http://localhost:3000') => {
  return {
    info: {
      _postman_id: 'e6a0d4c8-3e4b-4a5c-8971-8d2a5b1c9e01',
      name: 'Event Management REST API Collection',
      description:
        'Complete Postman Collection for Event Management REST API with JWT Authentication, RBAC, Events CRUD, Ticket Tiers, Registrations with QR Code, Search & Pagination, and Check-in verification.',
      schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json',
    },
    variable: [
      { key: 'baseUrl', value: baseUrl, type: 'string' },
      { key: 'authToken', value: '', type: 'string' },
      { key: 'eventId', value: '', type: 'string' },
      { key: 'ticketTypeId', value: '', type: 'string' },
      { key: 'registrationId', value: '', type: 'string' },
      { key: 'ticketCode', value: '', type: 'string' },
    ],
    item: [
      {
        name: 'Authentication',
        item: [
          {
            name: 'Register User (Attendee)',
            request: {
              method: 'POST',
              header: [{ key: 'Content-Type', value: 'application/json' }],
              body: {
                mode: 'raw',
                raw: JSON.stringify(
                  {
                    name: 'John Doe',
                    email: 'john@example.com',
                    password: 'password123',
                    role: 'ATTENDEE',
                  },
                  null,
                  2
                ),
              },
              url: {
                raw: '{{baseUrl}}/api/v1/auth/register',
                host: ['{{baseUrl}}'],
                path: ['api', 'v1', 'auth', 'register'],
              },
              description: 'Register a new user account with default ATTENDEE role',
            },
          },
          {
            name: 'Register Organizer',
            request: {
              method: 'POST',
              header: [{ key: 'Content-Type', value: 'application/json' }],
              body: {
                mode: 'raw',
                raw: JSON.stringify(
                  {
                    name: 'Alice Event Host',
                    email: 'alice.organizer@example.com',
                    password: 'password123',
                    role: 'ORGANIZER',
                  },
                  null,
                  2
                ),
              },
              url: {
                raw: '{{baseUrl}}/api/v1/auth/register',
                host: ['{{baseUrl}}'],
                path: ['api', 'v1', 'auth', 'register'],
              },
              description: 'Register an account with ORGANIZER privileges',
            },
          },
          {
            name: 'Login User',
            request: {
              method: 'POST',
              header: [{ key: 'Content-Type', value: 'application/json' }],
              body: {
                mode: 'raw',
                raw: JSON.stringify(
                  {
                    email: 'alice.organizer@example.com',
                    password: 'password123',
                  },
                  null,
                  2
                ),
              },
              url: {
                raw: '{{baseUrl}}/api/v1/auth/login',
                host: ['{{baseUrl}}'],
                path: ['api', 'v1', 'auth', 'login'],
              },
              description: 'Authenticate user and obtain JWT token.',
            },
          },
          {
            name: 'Get Current Profile (Me)',
            request: {
              method: 'GET',
              header: [{ key: 'Authorization', value: 'Bearer {{authToken}}' }],
              url: {
                raw: '{{baseUrl}}/api/v1/auth/me',
                host: ['{{baseUrl}}'],
                path: ['api', 'v1', 'auth', 'me'],
              },
              description: 'Fetch profile details of authenticated user',
            },
          },
        ],
      },
      {
        name: 'Events',
        item: [
          {
            name: 'Create Event (Organizer/Admin)',
            request: {
              method: 'POST',
              header: [
                { key: 'Content-Type', value: 'application/json' },
                { key: 'Authorization', value: 'Bearer {{authToken}}' },
              ],
              body: {
                mode: 'raw',
                raw: JSON.stringify(
                  {
                    title: 'Global AI Summit 2026',
                    description: 'The premier annual conference on artificial intelligence, deep learning, and agentic workflows.',
                    category: 'Technology',
                    venue: 'Convention Center Hall A, San Francisco, CA',
                    startDate: '2026-10-15T09:00:00.000Z',
                    endDate: '2026-10-17T18:00:00.000Z',
                    status: 'PUBLISHED',
                    ticketTypes: [
                      { name: 'Early Bird', price: 99.99, capacity: 100 },
                      { name: 'General Admission', price: 199.99, capacity: 500 },
                      { name: 'VIP Pass', price: 499.99, capacity: 50 }
                    ]
                  },
                  null,
                  2
                ),
              },
              url: {
                raw: '{{baseUrl}}/api/v1/events',
                host: ['{{baseUrl}}'],
                path: ['api', 'v1', 'events'],
              },
              description: 'Create a new event with initial ticket types',
            },
          },
          {
            name: 'List Events (Search, Filter, Pagination)',
            request: {
              method: 'GET',
              url: {
                raw: '{{baseUrl}}/api/v1/events?q=AI&category=Technology&page=1&limit=10&sortBy=startDate&order=asc',
                host: ['{{baseUrl}}'],
                path: ['api', 'v1', 'events'],
                query: [
                  { key: 'q', value: 'AI' },
                  { key: 'category', value: 'Technology' },
                  { key: 'page', value: '1' },
                  { key: 'limit', value: '10' },
                  { key: 'sortBy', value: 'startDate' },
                  { key: 'order', value: 'asc' },
                ],
              },
              description: 'Fetch paginated events with search, category filtering, price filtering, and sorting',
            },
          },
          {
            name: 'Get Event Details by ID',
            request: {
              method: 'GET',
              url: {
                raw: '{{baseUrl}}/api/v1/events/{{eventId}}',
                host: ['{{baseUrl}}'],
                path: ['api', 'v1', 'events', '{{eventId}}'],
              },
              description: 'Get full event information including ticket tiers and remaining capacity',
            },
          },
          {
            name: 'Update Event',
            request: {
              method: 'PUT',
              header: [
                { key: 'Content-Type', value: 'application/json' },
                { key: 'Authorization', value: 'Bearer {{authToken}}' },
              ],
              body: {
                mode: 'raw',
                raw: JSON.stringify(
                  {
                    title: 'Global AI & Robotics Summit 2026',
                    venue: 'Moscone Center, San Francisco, CA',
                  },
                  null,
                  2
                ),
              },
              url: {
                raw: '{{baseUrl}}/api/v1/events/{{eventId}}',
                host: ['{{baseUrl}}'],
                path: ['api', 'v1', 'events', '{{eventId}}'],
              },
              description: 'Update existing event details (Organizer owner or Admin)',
            },
          },
          {
            name: 'Add Ticket Tier to Event',
            request: {
              method: 'POST',
              header: [
                { key: 'Content-Type', value: 'application/json' },
                { key: 'Authorization', value: 'Bearer {{authToken}}' },
              ],
              body: {
                mode: 'raw',
                raw: JSON.stringify(
                  {
                    name: 'Student Discount Pass',
                    price: 49.99,
                    capacity: 200,
                  },
                  null,
                  2
                ),
              },
              url: {
                raw: '{{baseUrl}}/api/v1/events/{{eventId}}/tickets',
                host: ['{{baseUrl}}'],
                path: ['api', 'v1', 'events', '{{eventId}}', 'tickets'],
              },
              description: 'Add a new ticket tier to an existing event',
            },
          },
          {
            name: 'Get Ticket Tiers of Event',
            request: {
              method: 'GET',
              url: {
                raw: '{{baseUrl}}/api/v1/events/{{eventId}}/tickets',
                host: ['{{baseUrl}}'],
                path: ['api', 'v1', 'events', '{{eventId}}', 'tickets'],
              },
              description: 'Fetch all ticket types and sold count for a given event',
            },
          },
          {
            name: 'Delete Event',
            request: {
              method: 'DELETE',
              header: [{ key: 'Authorization', value: 'Bearer {{authToken}}' }],
              url: {
                raw: '{{baseUrl}}/api/v1/events/{{eventId}}',
                host: ['{{baseUrl}}'],
                path: ['api', 'v1', 'events', '{{eventId}}'],
              },
              description: 'Delete/Cancel an event',
            },
          },
        ],
      },
      {
        name: 'Registrations & Tickets',
        item: [
          {
            name: 'Register / Book Ticket',
            request: {
              method: 'POST',
              header: [
                { key: 'Content-Type', value: 'application/json' },
                { key: 'Authorization', value: 'Bearer {{authToken}}' },
              ],
              body: {
                mode: 'raw',
                raw: JSON.stringify(
                  {
                    eventId: '{{eventId}}',
                    ticketTypeId: '{{ticketTypeId}}',
                  },
                  null,
                  2
                ),
              },
              url: {
                raw: '{{baseUrl}}/api/v1/registrations',
                host: ['{{baseUrl}}'],
                path: ['api', 'v1', 'registrations'],
              },
              description: 'Book a ticket for an event. Generates a ticketCode and QR Code Data URL.',
            },
          },
          {
            name: 'Get My Purchased Tickets',
            request: {
              method: 'GET',
              header: [{ key: 'Authorization', value: 'Bearer {{authToken}}' }],
              url: {
                raw: '{{baseUrl}}/api/v1/registrations/my-tickets',
                host: ['{{baseUrl}}'],
                path: ['api', 'v1', 'registrations', 'my-tickets'],
              },
              description: 'List all ticket registrations belonging to current authenticated user',
            },
          },
          {
            name: 'Get Registration Ticket Details',
            request: {
              method: 'GET',
              header: [{ key: 'Authorization', value: 'Bearer {{authToken}}' }],
              url: {
                raw: '{{baseUrl}}/api/v1/registrations/{{registrationId}}',
                host: ['{{baseUrl}}'],
                path: ['api', 'v1', 'registrations', '{{registrationId}}'],
              },
              description: 'Fetch ticket information and QR Code image data URL',
            },
          },
          {
            name: 'Check-In Attendee at Venue (Organizer/Admin)',
            request: {
              method: 'POST',
              header: [
                { key: 'Content-Type', value: 'application/json' },
                { key: 'Authorization', value: 'Bearer {{authToken}}' },
              ],
              body: {
                mode: 'raw',
                raw: JSON.stringify(
                  {
                    ticketCode: '{{ticketCode}}',
                  },
                  null,
                  2
                ),
              },
              url: {
                raw: '{{baseUrl}}/api/v1/registrations/check-in',
                host: ['{{baseUrl}}'],
                path: ['api', 'v1', 'registrations', 'check-in'],
              },
              description: 'Verify ticket code at event entrance and update status to ATTENDED',
            },
          },
          {
            name: 'Cancel Registration Ticket',
            request: {
              method: 'POST',
              header: [{ key: 'Authorization', value: 'Bearer {{authToken}}' }],
              url: {
                raw: '{{baseUrl}}/api/v1/registrations/{{registrationId}}/cancel',
                host: ['{{baseUrl}}'],
                path: ['api', 'v1', 'registrations', '{{registrationId}}', 'cancel'],
              },
              description: 'Cancel ticket registration and restore available capacity',
            },
          },
        ],
      },
    ],
  };
};
