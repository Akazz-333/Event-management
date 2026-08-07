import { prisma } from '../config/prisma';
import { isMongoDB } from '../config/db';
import { Event as MongoEvent } from '../models/Event';
import { TicketType as MongoTicketType } from '../models/TicketType';
import { Registration as MongoRegistration } from '../models/Registration';
import { User as MongoUser } from '../models/User';
import { AppError } from '../utils/appError';
import { generateQRCodeDataUrl } from '../utils/qrcode';
import { RegistrationStatus, Role } from '../types';

export class RegistrationService {
  private static generateUniqueTicketCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = 'EVT-TKT-';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  static async registerForEvent(userId: string, eventId: string, ticketTypeId: string) {
    if (isMongoDB()) {
      const event = await MongoEvent.findById(eventId);
      if (!event) throw new AppError('Event not found', 404);
      if (event.status !== 'PUBLISHED') {
        throw new AppError(`Cannot register for event with status '${event.status}'`, 400);
      }

      const ticketType = await MongoTicketType.findById(ticketTypeId);
      if (!ticketType || ticketType.eventId.toString() !== eventId) {
        throw new AppError('Invalid ticket type specified for this event', 404);
      }

      if (ticketType.soldCount >= ticketType.capacity) {
        throw new AppError('Registration failed: Ticket tier is sold out', 400);
      }

      const existingReg = await MongoRegistration.findOne({
        userId,
        eventId,
        status: RegistrationStatus.CONFIRMED,
      });

      if (existingReg) {
        throw new AppError('You are already registered for this event with a confirmed ticket', 400);
      }

      const ticketCode = this.generateUniqueTicketCode();
      ticketType.soldCount += 1;
      await ticketType.save();

      const newReg = await MongoRegistration.create({
        ticketCode,
        userId,
        eventId,
        ticketTypeId,
        status: RegistrationStatus.CONFIRMED,
      });

      const user = await MongoUser.findById(userId).select('id name email');
      const regObj = newReg.toJSON() as any;

      const qrCodeUrl = await generateQRCodeDataUrl({
        registrationId: regObj.id,
        ticketCode: regObj.ticketCode,
        eventId: regObj.eventId,
        eventTitle: event.title,
        attendeeName: user ? user.name : 'Attendee',
        ticketType: ticketType.name,
      });

      return {
        ...regObj,
        event: { id: event.id, title: event.title, venue: event.venue, startDate: event.startDate, endDate: event.endDate },
        ticketType: { id: ticketType.id, name: ticketType.name, price: ticketType.price },
        user: user ? user.toJSON() : null,
        qrCodeUrl,
      };
    } else {
      return await prisma.$transaction(async (tx) => {
        const event = await tx.event.findUnique({
          where: { id: eventId },
        });

        if (!event) throw new AppError('Event not found', 404);
        if (event.status !== 'PUBLISHED') {
          throw new AppError(`Cannot register for event with status '${event.status}'`, 400);
        }

        const ticketType = await tx.ticketType.findUnique({
          where: { id: ticketTypeId },
        });

        if (!ticketType || ticketType.eventId !== eventId) {
          throw new AppError('Invalid ticket type specified for this event', 404);
        }

        if (ticketType.soldCount >= ticketType.capacity) {
          throw new AppError('Registration failed: Ticket tier is sold out', 400);
        }

        const existingReg = await tx.registration.findFirst({
          where: { userId, eventId, status: RegistrationStatus.CONFIRMED },
        });

        if (existingReg) {
          throw new AppError('You are already registered for this event with a confirmed ticket', 400);
        }

        const ticketCode = this.generateUniqueTicketCode();
        await tx.ticketType.update({
          where: { id: ticketTypeId },
          data: { soldCount: { increment: 1 } },
        });

        const registration = await tx.registration.create({
          data: {
            ticketCode,
            userId,
            eventId,
            ticketTypeId,
            status: RegistrationStatus.CONFIRMED,
          },
          include: {
            event: { select: { id: true, title: true, venue: true, startDate: true, endDate: true } },
            ticketType: { select: { id: true, name: true, price: true } },
            user: { select: { id: true, name: true, email: true } },
          },
        });

        const qrData = {
          registrationId: registration.id,
          ticketCode: registration.ticketCode,
          eventId: registration.eventId,
          eventTitle: registration.event.title,
          attendeeName: registration.user.name,
          ticketType: registration.ticketType.name,
        };

        const qrCodeUrl = await generateQRCodeDataUrl(qrData);

        return { ...registration, qrCodeUrl };
      });
    }
  }

  static async getUserRegistrations(userId: string) {
    if (isMongoDB()) {
      const registrations = await MongoRegistration.find({ userId })
        .sort({ createdAt: -1 })
        .populate('eventId', 'title venue startDate endDate category')
        .populate('ticketTypeId', 'name price');

      const results = await Promise.all(
        registrations.map(async (reg) => {
          const regObj = reg.toJSON() as any;
          const event = regObj.eventId;
          const ticketType = regObj.ticketTypeId;
          delete regObj.eventId;
          delete regObj.ticketTypeId;

          const qrCodeUrl = await generateQRCodeDataUrl({
            registrationId: regObj.id,
            ticketCode: regObj.ticketCode,
            eventId: event ? event._id.toString() : '',
          });

          return {
            ...regObj,
            event: event ? { id: event._id.toString(), title: event.title, venue: event.venue, startDate: event.startDate, endDate: event.endDate, category: event.category } : null,
            ticketType: ticketType ? { id: ticketType._id.toString(), name: ticketType.name, price: ticketType.price } : null,
            qrCodeUrl,
          };
        })
      );

      return results;
    } else {
      const registrations = await prisma.registration.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        include: {
          event: {
            select: { id: true, title: true, venue: true, startDate: true, endDate: true, category: true },
          },
          ticketType: { select: { id: true, name: true, price: true } },
        },
      });

      const results = await Promise.all(
        registrations.map(async (reg) => {
          const qrCodeUrl = await generateQRCodeDataUrl({
            registrationId: reg.id,
            ticketCode: reg.ticketCode,
            eventId: reg.eventId,
          });
          return { ...reg, qrCodeUrl };
        })
      );

      return results;
    }
  }

  static async getRegistrationById(registrationId: string, userId: string, userRole: Role) {
    if (isMongoDB()) {
      const reg = await MongoRegistration.findById(registrationId)
        .populate('eventId')
        .populate('ticketTypeId')
        .populate('userId', 'name email');

      if (!reg) throw new AppError('Registration ticket not found', 404);

      const regObj = reg.toJSON() as any;
      const event = regObj.eventId;
      const user = regObj.userId;
      const ticketType = regObj.ticketTypeId;

      const isOwner = regObj.userId === userId || (user && user._id.toString() === userId);
      const isOrganizer = event && event.organizerId && event.organizerId.toString() === userId;
      const isAdmin = userRole === Role.ADMIN;

      if (!isOwner && !isOrganizer && !isAdmin) {
        throw new AppError('Access denied to this ticket', 403);
      }

      const qrCodeUrl = await generateQRCodeDataUrl({
        registrationId: regObj.id,
        ticketCode: regObj.ticketCode,
        eventId: event ? event._id.toString() : '',
        eventTitle: event ? event.title : '',
        attendeeName: user ? user.name : '',
        ticketType: ticketType ? ticketType.name : '',
      });

      return {
        ...regObj,
        event: event ? { id: event._id.toString(), title: event.title, venue: event.venue, startDate: event.startDate, endDate: event.endDate } : null,
        ticketType: ticketType ? { id: ticketType._id.toString(), name: ticketType.name, price: ticketType.price } : null,
        user: user ? { id: user._id.toString(), name: user.name, email: user.email } : null,
        qrCodeUrl,
      };
    } else {
      const registration = await prisma.registration.findUnique({
        where: { id: registrationId },
        include: {
          event: { include: { organizer: { select: { id: true, name: true } } } },
          ticketType: true,
          user: { select: { id: true, name: true, email: true } },
        },
      });

      if (!registration) throw new AppError('Registration ticket not found', 404);

      const isOwner = registration.userId === userId;
      const isOrganizer = registration.event.organizerId === userId;
      const isAdmin = userRole === Role.ADMIN;

      if (!isOwner && !isOrganizer && !isAdmin) {
        throw new AppError('Access denied to this ticket', 403);
      }

      const qrCodeUrl = await generateQRCodeDataUrl({
        registrationId: registration.id,
        ticketCode: registration.ticketCode,
        eventId: registration.eventId,
        eventTitle: registration.event.title,
        attendeeName: registration.user.name,
        ticketType: registration.ticketType.name,
      });

      return { ...registration, qrCodeUrl };
    }
  }

  static async cancelRegistration(registrationId: string, userId: string, userRole: Role) {
    if (isMongoDB()) {
      const reg = await MongoRegistration.findById(registrationId);
      if (!reg) throw new AppError('Registration ticket not found', 404);

      const isOwner = reg.userId.toString() === userId;
      const isAdmin = userRole === Role.ADMIN;

      if (!isOwner && !isAdmin) {
        throw new AppError('You do not have permission to cancel this registration', 403);
      }

      if (reg.status === RegistrationStatus.CANCELLED) {
        throw new AppError('Registration is already cancelled', 400);
      }

      if (reg.status === RegistrationStatus.ATTENDED) {
        throw new AppError('Cannot cancel a ticket that has already been checked-in/attended', 400);
      }

      reg.status = RegistrationStatus.CANCELLED;
      await reg.save();

      const ticketType = await MongoTicketType.findById(reg.ticketTypeId);
      if (ticketType && ticketType.soldCount > 0) {
        ticketType.soldCount -= 1;
        await ticketType.save();
      }

      return reg.toJSON();
    } else {
      return await prisma.$transaction(async (tx) => {
        const registration = await tx.registration.findUnique({
          where: { id: registrationId },
        });

        if (!registration) throw new AppError('Registration ticket not found', 404);

        const isOwner = registration.userId === userId;
        const isAdmin = userRole === Role.ADMIN;

        if (!isOwner && !isAdmin) {
          throw new AppError('You do not have permission to cancel this registration', 403);
        }

        if (registration.status === RegistrationStatus.CANCELLED) {
          throw new AppError('Registration is already cancelled', 400);
        }

        if (registration.status === RegistrationStatus.ATTENDED) {
          throw new AppError('Cannot cancel a ticket that has already been checked-in/attended', 400);
        }

        const updated = await tx.registration.update({
          where: { id: registrationId },
          data: { status: RegistrationStatus.CANCELLED },
        });

        await tx.ticketType.update({
          where: { id: registration.ticketTypeId },
          data: { soldCount: { decrement: 1 } },
        });

        return updated;
      });
    }
  }

  static async checkInAttendee(ticketCode: string, userId: string, userRole: Role) {
    if (isMongoDB()) {
      const reg = await MongoRegistration.findOne({ ticketCode: ticketCode.toUpperCase().trim() })
        .populate('eventId')
        .populate('userId', 'name email')
        .populate('ticketTypeId', 'name');

      if (!reg) throw new AppError('Invalid ticket code', 404);

      const event = reg.eventId as any;
      const isOrganizer = event && event.organizerId && event.organizerId.toString() === userId;
      const isAdmin = userRole === Role.ADMIN;

      if (!isOrganizer && !isAdmin) {
        throw new AppError('You do not have permission to perform check-in for this event', 403);
      }

      if (reg.status === RegistrationStatus.CANCELLED) {
        throw new AppError('Check-in failed: This ticket registration was cancelled', 400);
      }

      if (reg.status === RegistrationStatus.ATTENDED) {
        throw new AppError(`Ticket already checked in at ${reg.checkedInAt?.toISOString()}`, 400);
      }

      reg.status = RegistrationStatus.ATTENDED;
      reg.checkedInAt = new Date();
      await reg.save();

      const regObj = reg.toJSON() as any;
      const user = regObj.userId;
      const ticketType = regObj.ticketTypeId;

      return {
        ...regObj,
        user: user ? { id: user._id.toString(), name: user.name, email: user.email } : null,
        event: event ? { id: event._id.toString(), title: event.title } : null,
        ticketType: ticketType ? { id: ticketType._id.toString(), name: ticketType.name } : null,
      };
    } else {
      const registration = await prisma.registration.findUnique({
        where: { ticketCode },
        include: {
          event: true,
          user: { select: { id: true, name: true, email: true } },
          ticketType: { select: { id: true, name: true } },
        },
      });

      if (!registration) throw new AppError('Invalid ticket code', 404);

      if (registration.event.organizerId !== userId && userRole !== Role.ADMIN) {
        throw new AppError('You do not have permission to perform check-in for this event', 403);
      }

      if (registration.status === RegistrationStatus.CANCELLED) {
        throw new AppError('Check-in failed: This ticket registration was cancelled', 400);
      }

      if (registration.status === RegistrationStatus.ATTENDED) {
        throw new AppError(`Ticket already checked in at ${registration.checkedInAt?.toISOString()}`, 400);
      }

      const updated = await prisma.registration.update({
        where: { ticketCode },
        data: {
          status: RegistrationStatus.ATTENDED,
          checkedInAt: new Date(),
        },
        include: {
          user: { select: { id: true, name: true, email: true } },
          event: { select: { id: true, title: true } },
          ticketType: { select: { id: true, name: true } },
        },
      });

      return updated;
    }
  }
}
