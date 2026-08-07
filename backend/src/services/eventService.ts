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

      if (params.startDate || params.endDate) {
        query.startDate = {};
        if (params.startDate) query.startDate.$gte = new Date(params.startDate);
        if (params.endDate) query.startDate.$lte = new Date(params.endDate);
      }

      const sortBy = params.sortBy || 'startDate';
      const order = params.order === 'desc' ? -1 : 1;

      const [mongoEvents, totalItems] = await Promise.all([
        MongoEvent.find(query)
          .sort({ [sortBy]: order })
          .skip(skip)
          .limit(limit)
          .populate('organizerId', 'name email'),
        MongoEvent.countDocuments(query),
      ]);

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
        pagination: {
          page,
          limit,
          totalItems,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
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

      if (params.category) where.category = { equals: params.category };
      if (params.status) where.status = params.status;

      const sortBy = params.sortBy || 'startDate';
      const order = params.order || 'asc';

      const [events, totalItems] = await Promise.all([
        prisma.event.findMany({
          where,
          skip,
          take: limit,
          orderBy: { [sortBy]: order },
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
