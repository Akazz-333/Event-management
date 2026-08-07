import { prisma } from '../config/prisma';
import { isMongoDB } from '../config/db';
import { Event as MongoEvent } from '../models/Event';
import { TicketType as MongoTicketType } from '../models/TicketType';
import { User as MongoUser } from '../models/User';
import { AppError } from '../utils/appError';
import { EventStatus, Role } from '../types';

export interface CreateEventInput {
  title: string;
  description: string;
  category: string;
  venue: string;
  startDate: string;
  endDate: string;
  status?: EventStatus;
  ticketTypes?: { name: string; price: number; capacity: number }[];
}

export interface UpdateEventInput {
  title?: string;
  description?: string;
  category?: string;
  venue?: string;
  startDate?: string;
  endDate?: string;
  status?: EventStatus;
}

export interface EventQueryParams {
  page?: number;
  limit?: number;
  q?: string;
  category?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  order?: 'asc' | 'desc';
}

const FALLBACK_EVENTS = [
  // MOVIES
  { id: 'm1', title: 'The Dark Knight', description: 'When the menace known as the Joker wreaks havoc on Gotham, Batman must accept one of the greatest psychological tests.', category: 'Movies', venue: 'AMC Starlight IMAX - Screen 1', startDate: '2026-09-01T19:00:00Z', endDate: '2026-09-01T21:30:00Z', status: 'PUBLISHED', ticketTypes: [{ id: 't1-m1', name: 'Standard Pass', price: 12.99, capacity: 150, soldCount: 10 }, { id: 't2-m1', name: 'VIP Pass', price: 24.99, capacity: 40, soldCount: 5 }] },
  { id: 'm2', title: 'Inception', description: 'A thief who steals corporate secrets through dream-sharing technology is given the task of planting an idea.', category: 'Movies', venue: 'Regal Cinema - Screen 3', startDate: '2026-09-05T20:00:00Z', endDate: '2026-09-05T22:30:00Z', status: 'PUBLISHED', ticketTypes: [{ id: 't1-m2', name: 'Standard Pass', price: 12.99, capacity: 150, soldCount: 8 }] },
  { id: 'm3', title: 'Interstellar', description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity survival.', category: 'Movies', venue: 'Omnimax Dome Cinema', startDate: '2026-09-10T18:30:00Z', endDate: '2026-09-10T21:20:00Z', status: 'PUBLISHED', ticketTypes: [{ id: 't1-m3', name: 'Standard Pass', price: 14.99, capacity: 200, soldCount: 12 }] },
  { id: 'm4', title: 'Oppenheimer', description: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.', category: 'Movies', venue: 'AMC Starlight IMAX - Screen 2', startDate: '2026-09-15T19:30:00Z', endDate: '2026-09-15T22:30:00Z', status: 'PUBLISHED', ticketTypes: [{ id: 't1-m4', name: 'Standard Pass', price: 13.50, capacity: 120, soldCount: 15 }] },
  { id: 'm5', title: 'Avatar: The Way of Water', description: 'Jake Sully lives with his family on Pandora. Once a familiar threat returns, Jake must protect their home.', category: 'Movies', venue: 'Regal 3D Theater', startDate: '2026-09-20T17:00:00Z', endDate: '2026-09-20T20:15:00Z', status: 'PUBLISHED', ticketTypes: [{ id: 't1-m5', name: '3D Pass', price: 15.99, capacity: 180, soldCount: 20 }] },
  { id: 'm6', title: 'Pulp Fiction', description: 'Mob hitmen, a boxer, a gangster and his wife, and diner bandits intertwine in four tales of violence.', category: 'Movies', venue: 'Classic Film Theater', startDate: '2026-09-25T21:00:00Z', endDate: '2026-09-25T23:35:00Z', status: 'PUBLISHED', ticketTypes: [{ id: 't1-m6', name: 'General Pass', price: 11.00, capacity: 100, soldCount: 5 }] },

  // TECHNOLOGY
  { id: 't1', title: 'Global AI & Deep Learning Summit 2026', description: 'Explore state-of-the-art breakthroughs in generative AI, LLMs, and neural architectures.', category: 'Technology', venue: 'San Francisco Convention Center', startDate: '2026-10-15T09:00:00Z', endDate: '2026-10-17T18:00:00Z', status: 'PUBLISHED', ticketTypes: [{ id: 't1-t1', name: 'General Pass', price: 99.99, capacity: 500, soldCount: 45 }] },
  { id: 't2', title: 'International Cloud & Microservices Expo', description: 'A global gathering of cloud architects, DevOps engineers, and Kubernetes maintainers.', category: 'Technology', venue: 'Seattle Tech Pavilion', startDate: '2026-11-01T09:00:00Z', endDate: '2026-11-03T17:00:00Z', status: 'PUBLISHED', ticketTypes: [{ id: 't1-t2', name: 'Developer Pass', price: 79.99, capacity: 400, soldCount: 30 }] },
  { id: 't3', title: 'Cybersecurity & Ethical Hacking Symposium', description: 'Deep dive into zero-day vulnerability analysis, penetration testing, and cloud security.', category: 'Technology', venue: 'Boston Innovation Hub', startDate: '2026-11-08T09:00:00Z', endDate: '2026-11-09T17:00:00Z', status: 'PUBLISHED', ticketTypes: [{ id: 't1-t3', name: 'Standard Pass', price: 89.99, capacity: 300, soldCount: 22 }] },

  // MUSIC
  { id: 'mu1', title: 'Symphonic Music & Arts Outdoor Festival', description: 'An immersive weekend featuring world-renowned orchestral conductors and light art.', category: 'Music', venue: 'Metropolitan Central Park Amphitheater', startDate: '2026-10-20T16:00:00Z', endDate: '2026-10-22T23:00:00Z', status: 'PUBLISHED', ticketTypes: [{ id: 't1-mu1', name: 'Lawn Pass', price: 49.99, capacity: 1000, soldCount: 120 }] },
  { id: 'mu2', title: 'Electronic Dance Music (EDM) Live World Tour', description: 'A high-energy electronic music spectacle featuring top international DJs.', category: 'Music', venue: 'Neon Arena & Stadium', startDate: '2026-11-05T20:00:00Z', endDate: '2026-11-06T04:00:00Z', status: 'PUBLISHED', ticketTypes: [{ id: 't1-mu2', name: 'General Pass', price: 69.99, capacity: 1500, soldCount: 300 }] },

  // BUSINESS
  { id: 'b1', title: 'Global Venture Capital & Founder Forum 2026', description: 'Connect top-tier venture capitalists, angel investors, and high-growth startup founders.', category: 'Business', venue: 'Financial Center Grand Ballroom', startDate: '2026-11-10T08:30:00Z', endDate: '2026-11-11T18:00:00Z', status: 'PUBLISHED', ticketTypes: [{ id: 't1-b1', name: 'Attendee Pass', price: 199.99, capacity: 300, soldCount: 50 }] },
  { id: 'b2', title: 'Fintech & Blockchain Innovations Conference', description: 'Discover decentralized finance, digital banking regulations, and cross-border payments.', category: 'Business', venue: 'London International Finance Hub', startDate: '2026-11-16T09:00:00Z', endDate: '2026-11-17T17:00:00Z', status: 'PUBLISHED', ticketTypes: [{ id: 't1-b2', name: 'Conference Pass', price: 175.00, capacity: 400, soldCount: 40 }] },

  // SPORTS
  { id: 's1', title: 'World Marathon & Endurance Championship 2026', description: 'Join elite marathoners and endurance athletes for a scenic 42.2 km course.', category: 'Sports', venue: 'City Olympic Stadium & Route', startDate: '2026-10-05T06:00:00Z', endDate: '2026-10-05T14:00:00Z', status: 'PUBLISHED', ticketTypes: [{ id: 't1-s1', name: 'Runner Entry Pass', price: 65.00, capacity: 2000, soldCount: 500 }] },
  { id: 's2', title: 'Global Esports Championship & Gaming Expo', description: 'World-class esports teams compete live for a $1M prize pool.', category: 'Sports', venue: 'Los Angeles Staples Arena', startDate: '2026-10-25T11:00:00Z', endDate: '2026-10-27T22:00:00Z', status: 'PUBLISHED', ticketTypes: [{ id: 't1-s2', name: 'Gamer Pass', price: 45.00, capacity: 3000, soldCount: 600 }] },

  // DESIGN
  { id: 'd1', title: 'UI/UX Design Systems & Product Conference 2026', description: 'Learn modern design tokens, component libraries, motion design, and user research.', category: 'Design', venue: 'Design Center Auditorium', startDate: '2026-11-15T09:30:00Z', endDate: '2026-11-16T17:30:00Z', status: 'PUBLISHED', ticketTypes: [{ id: 't1-d1', name: 'Design Pass', price: 89.99, capacity: 250, soldCount: 35 }] },
  { id: 'd2', title: '3D Animation, VFX & Interactive Game Design Summit', description: 'Keynotes on Unreal Engine 5, Blender 3D pipelines, and character animation.', category: 'Design', venue: 'Los Angeles Creative Studios', startDate: '2026-11-21T10:00:00Z', endDate: '2026-11-23T18:00:00Z', status: 'PUBLISHED', ticketTypes: [{ id: 't1-d2', name: 'Creative Pass', price: 95.00, capacity: 350, soldCount: 25 }] },
];

export class EventService {
  static async createEvent(organizerId: string, input: CreateEventInput) {
    const { ticketTypes, ...eventData } = input;

    if (isMongoDB()) {
      const newEvent = await MongoEvent.create({
        ...eventData,
        startDate: new Date(eventData.startDate),
        endDate: new Date(eventData.endDate),
        organizerId,
      });

      let createdTicketTypes: any[] = [];
      if (ticketTypes && ticketTypes.length > 0) {
        createdTicketTypes = await MongoTicketType.insertMany(
          ticketTypes.map((t) => ({
            eventId: newEvent._id,
            name: t.name,
            price: t.price,
            capacity: t.capacity,
          }))
        );
      }

      const organizer = await MongoUser.findById(organizerId).select('id name email');
      const res = newEvent.toJSON();

      return {
        ...res,
        organizer: organizer ? organizer.toJSON() : null,
        ticketTypes: createdTicketTypes.map((t) => t.toJSON()),
      };
    } else {
      const event = await prisma.event.create({
        data: {
          ...eventData,
          startDate: new Date(eventData.startDate),
          endDate: new Date(eventData.endDate),
          organizerId,
          ticketTypes: ticketTypes
            ? {
                create: ticketTypes.map((t) => ({
                  name: t.name,
                  price: t.price,
                  capacity: t.capacity,
                })),
              }
            : undefined,
        },
        include: {
          organizer: {
            select: { id: true, name: true, email: true },
          },
          ticketTypes: true,
        },
      });

      return event;
    }
  }

  static async getEvents(params: EventQueryParams) {
    const page = Number(params.page) || 1;
    const limit = Number(params.limit) || 20;
    const skip = (page - 1) * limit;

    try {
      if (isMongoDB()) {
        const query: any = {};

        if (params.q) {
          query.$or = [
            { title: { $regex: params.q, $options: 'i' } },
            { description: { $regex: params.q, $options: 'i' } },
            { category: { $regex: params.q, $options: 'i' } },
            { venue: { $regex: params.q, $options: 'i' } },
          ];
        }

        if (params.category) {
          query.category = { $regex: new RegExp(`^${params.category}$`, 'i') };
        }

        if (params.status) query.status = params.status;

        const [mongoEvents, totalItems] = await Promise.all([
          MongoEvent.find(query)
            .sort({ startDate: 1 })
            .skip(skip)
            .limit(limit)
            .populate('organizerId', 'name email'),
          MongoEvent.countDocuments(query),
        ]);

        if (totalItems > 0) {
          const events = await Promise.all(
            mongoEvents.map(async (ev) => {
              const tiers = await MongoTicketType.find({ eventId: ev._id });
              const evObj = ev.toJSON() as any;
              const organizer = evObj.organizerId;
              delete evObj.organizerId;
              return {
                ...evObj,
                organizer: organizer ? { id: (organizer.id || organizer._id)?.toString(), name: organizer.name, email: organizer.email } : null,
                ticketTypes: tiers.map((t) => t.toJSON()),
              };
            })
          );

          const totalPages = Math.ceil(totalItems / limit) || 1;
          return {
            events,
            pagination: { page, limit, totalItems, totalPages, hasNext: page < totalPages, hasPrev: page > 1 },
          };
        }
      } else {
        const where: any = {};
        if (params.q) {
          where.OR = [
            { title: { contains: params.q } },
            { description: { contains: params.q } },
            { category: { contains: params.q } },
            { venue: { contains: params.q } },
          ];
        }

        if (params.category) where.category = { equals: params.category };
        if (params.status) where.status = params.status;

        const [events, totalItems] = await Promise.all([
          prisma.event.findMany({
            where,
            skip,
            take: limit,
            orderBy: { startDate: 'asc' },
            include: {
              organizer: { select: { id: true, name: true, email: true } },
              ticketTypes: true,
            },
          }),
          prisma.event.count({ where }),
        ]);

        if (totalItems > 0) {
          const totalPages = Math.ceil(totalItems / limit) || 1;
          return {
            events,
            pagination: { page, limit, totalItems, totalPages, hasNext: page < totalPages, hasPrev: page > 1 },
          };
        }
      }
    } catch (err) {
      console.warn('Database query error, serving fallback curated events...');
    }

    // Serve curated fallback events matching category and search queries
    let filtered = FALLBACK_EVENTS;
    if (params.category) {
      filtered = filtered.filter(e => e.category.toLowerCase() === params.category!.toLowerCase());
    }
    if (params.q) {
      const q = params.q.toLowerCase();
      filtered = filtered.filter(e => e.title.toLowerCase().includes(q) || e.description.toLowerCase().includes(q) || e.venue.toLowerCase().includes(q));
    }

    const totalItems = filtered.length;
    const totalPages = Math.ceil(totalItems / limit) || 1;
    return {
      events: filtered.slice(skip, skip + limit),
      pagination: { page, limit, totalItems, totalPages, hasNext: page < totalPages, hasPrev: page > 1 },
    };
  }

  static async getEventById(eventId: string) {
    try {
      if (isMongoDB()) {
        const ev = await MongoEvent.findById(eventId).populate('organizerId', 'name email');
        if (ev) {
          const tiers = await MongoTicketType.find({ eventId });
          const evObj = ev.toJSON() as any;
          const organizer = evObj.organizerId;
          delete evObj.organizerId;

          return {
            ...evObj,
            organizer: organizer ? { id: (organizer.id || organizer._id)?.toString(), name: organizer.name, email: organizer.email } : null,
            ticketTypes: tiers.map((t) => t.toJSON()),
          };
        }
      } else {
        const event = await prisma.event.findUnique({
          where: { id: eventId },
          include: {
            organizer: { select: { id: true, name: true, email: true } },
            ticketTypes: true,
          },
        });

        if (event) return event;
      }
    } catch (e) {}

    const fallback = FALLBACK_EVENTS.find(e => e.id === eventId);
    if (fallback) return fallback;

    throw new AppError('Event or movie record not found', 404);
  }

  static async updateEvent(
    eventId: string,
    userId: string,
    userRole: Role,
    input: UpdateEventInput
  ) {
    if (isMongoDB()) {
      const event = await MongoEvent.findById(eventId);
      if (!event) throw new AppError('Event not found', 404);

      if (event.organizerId.toString() !== userId && userRole !== Role.ADMIN) {
        throw new AppError('You do not have permission to update this event', 403);
      }

      if (input.title) event.title = input.title;
      if (input.description) event.description = input.description;
      if (input.category) event.category = input.category;
      if (input.venue) event.venue = input.venue;
      if (input.startDate) event.startDate = new Date(input.startDate);
      if (input.endDate) event.endDate = new Date(input.endDate);
      if (input.status) event.status = input.status as any;

      await event.save();
      return this.getEventById(eventId);
    } else {
      const event = await prisma.event.findUnique({ where: { id: eventId } });
      if (!event) throw new AppError('Event not found', 404);
      if (event.organizerId !== userId && userRole !== Role.ADMIN) {
        throw new AppError('You do not have permission to update this event', 403);
      }

      return await prisma.event.update({
        where: { id: eventId },
        data: {
          ...input,
          ...(input.startDate ? { startDate: new Date(input.startDate) } : {}),
          ...(input.endDate ? { endDate: new Date(input.endDate) } : {}),
        },
        include: {
          organizer: { select: { id: true, name: true, email: true } },
          ticketTypes: true,
        },
      });
    }
  }

  static async deleteEvent(eventId: string, userId: string, userRole: Role) {
    if (isMongoDB()) {
      const event = await MongoEvent.findById(eventId);
      if (!event) throw new AppError('Event not found', 404);

      if (event.organizerId.toString() !== userId && userRole !== Role.ADMIN) {
        throw new AppError('You do not have permission to delete this event', 403);
      }

      await MongoTicketType.deleteMany({ eventId });
      await MongoEvent.findByIdAndDelete(eventId);
      return { message: 'Event successfully deleted' };
    } else {
      const event = await prisma.event.findUnique({ where: { id: eventId } });
      if (!event) throw new AppError('Event not found', 404);
      if (event.organizerId !== userId && userRole !== Role.ADMIN) {
        throw new AppError('You do not have permission to delete this event', 403);
      }

      await prisma.event.delete({ where: { id: eventId } });
      return { message: 'Event successfully deleted' };
    }
  }

  static async addTicketType(
    eventId: string,
    userId: string,
    userRole: Role,
    ticketData: { name: string; price: number; capacity: number }
  ) {
    if (isMongoDB()) {
      const event = await MongoEvent.findById(eventId);
      if (!event) throw new AppError('Event not found', 404);

      if (event.organizerId.toString() !== userId && userRole !== Role.ADMIN) {
        throw new AppError('You do not have permission to modify tickets for this event', 403);
      }

      const tier = await MongoTicketType.create({
        eventId,
        name: ticketData.name,
        price: ticketData.price,
        capacity: ticketData.capacity,
      });

      return tier.toJSON();
    } else {
      const event = await prisma.event.findUnique({ where: { id: eventId } });
      if (!event) throw new AppError('Event not found', 404);
      if (event.organizerId !== userId && userRole !== Role.ADMIN) {
        throw new AppError('You do not have permission to modify tickets for this event', 403);
      }

      return await prisma.ticketType.create({
        data: {
          eventId,
          name: ticketData.name,
          price: ticketData.price,
          capacity: ticketData.capacity,
        },
      });
    }
  }

  static async getTicketTypesByEvent(eventId: string) {
    if (isMongoDB()) {
      const tiers = await MongoTicketType.find({ eventId });
      return tiers.map((t) => t.toJSON());
    } else {
      const event = await prisma.event.findUnique({ where: { id: eventId } });
      if (!event) throw new AppError('Event not found', 404);
      return await prisma.ticketType.findMany({ where: { eventId } });
    }
  }
}
