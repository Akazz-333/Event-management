import { prisma } from '../config/prisma';
import { isMongoDB } from '../config/db';
import { Event as MongoEvent } from '../models/Event';
import { TicketType as MongoTicketType } from '../models/TicketType';
import { User as MongoUser } from '../models/User';
import { Movie as MongoMovie } from '../models/Movie';
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
    const selectedCat = (params.category || '').trim();

    if (isMongoDB()) {
      let combinedResults: any[] = [];

      // If category is "Movies", return sample_mflix movies
      if (selectedCat.toLowerCase() === 'movies') {
        const movieQuery: any = {};
        if (params.q) {
          movieQuery.$or = [
            { title: { $regex: params.q, $options: 'i' } },
            { plot: { $regex: params.q, $options: 'i' } },
            { genres: { $regex: params.q, $options: 'i' } },
          ];
        }

        const [movies, totalMovies] = await Promise.all([
          MongoMovie.find(movieQuery).skip(skip).limit(limit),
          MongoMovie.countDocuments(movieQuery),
        ]);

        const mappedMovies = movies.map((m) => {
          const mObj = m.toJSON() as any;
          return {
            id: mObj.id,
            title: mObj.title,
            description: mObj.fullplot || mObj.plot || `Directed by ${(mObj.directors || []).join(', ')}.`,
            category: 'Movies',
            venue: 'AMC Starlight Theater & IMAX',
            startDate: mObj.released || new Date('2026-09-01'),
            endDate: new Date((mObj.released ? new Date(mObj.released).getTime() : Date.now()) + (mObj.runtime || 120) * 60000),
            status: 'PUBLISHED',
            poster: mObj.poster,
            imdb: mObj.imdb,
            directors: mObj.directors,
            cast: mObj.cast,
            ticketTypes: [
              { id: `t1-${mObj.id}`, name: 'Standard Seat Pass', price: 12.99, capacity: 150, soldCount: 10 },
              { id: `t2-${mObj.id}`, name: 'VIP Recliner Pass', price: 24.99, capacity: 40, soldCount: 5 },
            ],
          };
        });

        const totalPages = Math.ceil(totalMovies / limit) || 1;
        return {
          events: mappedMovies,
          pagination: { page, limit, totalItems: totalMovies, totalPages, hasNext: page < totalPages, hasPrev: page > 1 },
        };
      }

      // Query standard MongoDB events
      const eventQuery: any = {};
      if (params.q) {
        eventQuery.$or = [
          { title: { $regex: params.q, $options: 'i' } },
          { description: { $regex: params.q, $options: 'i' } },
          { category: { $regex: params.q, $options: 'i' } },
          { venue: { $regex: params.q, $options: 'i' } },
        ];
      }

      if (selectedCat && selectedCat.toLowerCase() !== 'movies') {
        eventQuery.category = { $regex: new RegExp(`^${selectedCat}$`, 'i') };
      }

      if (params.status) eventQuery.status = params.status;

      const [mongoEvents, totalEvents] = await Promise.all([
        MongoEvent.find(eventQuery)
          .sort({ startDate: 1 })
          .skip(skip)
          .limit(limit)
          .populate('organizerId', 'name email'),
        MongoEvent.countDocuments(eventQuery),
      ]);

      const mappedEvents = await Promise.all(
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

      // If viewing "All Categories" (empty category filter), combine movies and events
      if (!selectedCat) {
        const movies = await MongoMovie.find({}).limit(4);
        const mappedMovies = movies.map((m) => {
          const mObj = m.toJSON() as any;
          return {
            id: mObj.id,
            title: mObj.title,
            description: mObj.fullplot || mObj.plot || `Directed by ${(mObj.directors || []).join(', ')}.`,
            category: 'Movies',
            venue: 'AMC Starlight Theater & IMAX',
            startDate: mObj.released || new Date('2026-09-01'),
            endDate: new Date((mObj.released ? new Date(mObj.released).getTime() : Date.now()) + (mObj.runtime || 120) * 60000),
            status: 'PUBLISHED',
            poster: mObj.poster,
            imdb: mObj.imdb,
            directors: mObj.directors,
            cast: mObj.cast,
            ticketTypes: [
              { id: `t1-${mObj.id}`, name: 'Standard Seat Pass', price: 12.99, capacity: 150, soldCount: 10 },
              { id: `t2-${mObj.id}`, name: 'VIP Recliner Pass', price: 24.99, capacity: 40, soldCount: 5 },
            ],
          };
        });

        combinedResults = [...mappedMovies, ...mappedEvents];
        const totalItems = combinedResults.length;
        const totalPages = Math.ceil(totalItems / limit) || 1;

        return {
          events: combinedResults,
          pagination: { page, limit, totalItems, totalPages, hasNext: page < totalPages, hasPrev: page > 1 },
        };
      }

      const totalPages = Math.ceil(totalEvents / limit) || 1;
      return {
        events: mappedEvents,
        pagination: { page, limit, totalItems: totalEvents, totalPages, hasNext: page < totalPages, hasPrev: page > 1 },
      };
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

      if (selectedCat) where.category = { equals: selectedCat };
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

      const totalPages = Math.ceil(totalItems / limit) || 1;
      return {
        events,
        pagination: { page, limit, totalItems, totalPages, hasNext: page < totalPages, hasPrev: page > 1 },
      };
    }
  }

  static async getEventById(eventId: string) {
    if (isMongoDB()) {
      const movie = await MongoMovie.findById(eventId);
      if (movie) {
        const mObj = movie.toJSON() as any;
        return {
          id: mObj.id,
          title: mObj.title,
          description: mObj.fullplot || mObj.plot || `Directed by ${(mObj.directors || []).join(', ')}.`,
          category: 'Movies',
          venue: 'AMC Starlight Theater & IMAX',
          startDate: mObj.released || new Date('2026-09-01'),
          endDate: new Date((mObj.released ? new Date(mObj.released).getTime() : Date.now()) + (mObj.runtime || 120) * 60000),
          status: 'PUBLISHED',
          poster: mObj.poster,
          imdb: mObj.imdb,
          directors: mObj.directors,
          cast: mObj.cast,
          runtime: mObj.runtime,
          organizer: { id: 'mflix-admin', name: 'Sample MFlix Network', email: 'support@mflix.com' },
          ticketTypes: [
            { id: `t1-${mObj.id}`, name: 'Standard Seat Pass', price: 12.99, capacity: 150, soldCount: 10 },
            { id: `t2-${mObj.id}`, name: 'VIP Recliner Pass', price: 24.99, capacity: 40, soldCount: 5 },
          ],
        };
      }

      const ev = await MongoEvent.findById(eventId).populate('organizerId', 'name email');
      if (!ev) throw new AppError('Event or movie record not found', 404);

      const tiers = await MongoTicketType.find({ eventId });
      const evObj = ev.toJSON() as any;
      const organizer = evObj.organizerId;
      delete evObj.organizerId;

      return {
        ...evObj,
        organizer: organizer ? { id: (organizer.id || organizer._id)?.toString(), name: organizer.name, email: organizer.email } : null,
        ticketTypes: tiers.map((t) => t.toJSON()),
      };
    } else {
      const event = await prisma.event.findUnique({
        where: { id: eventId },
        include: {
          organizer: { select: { id: true, name: true, email: true } },
          ticketTypes: true,
        },
      });

      if (!event) throw new AppError('Event not found', 404);
      return event;
    }
  }

  static async updateEvent(eventId: string, userId: string, userRole: Role, input: UpdateEventInput) {
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

  static async addTicketType(eventId: string, userId: string, userRole: Role, ticketData: { name: string; price: number; capacity: number }) {
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
