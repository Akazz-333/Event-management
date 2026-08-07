"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegistrationService = void 0;
const prisma_1 = require("../config/prisma");
const db_1 = require("../config/db");
const Event_1 = require("../models/Event");
const TicketType_1 = require("../models/TicketType");
const Registration_1 = require("../models/Registration");
const User_1 = require("../models/User");
const appError_1 = require("../utils/appError");
const qrcode_1 = require("../utils/qrcode");
const types_1 = require("../types");
class RegistrationService {
    static generateUniqueTicketCode() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = 'EVT-TKT-';
        for (let i = 0; i < 6; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return code;
    }
    static async registerForEvent(userId, eventId, ticketTypeId) {
        if ((0, db_1.isMongoDB)()) {
            const event = await Event_1.Event.findById(eventId);
            if (!event)
                throw new appError_1.AppError('Event not found', 404);
            if (event.status !== 'PUBLISHED') {
                throw new appError_1.AppError(`Cannot register for event with status '${event.status}'`, 400);
            }
            const ticketType = await TicketType_1.TicketType.findById(ticketTypeId);
            if (!ticketType || ticketType.eventId.toString() !== eventId) {
                throw new appError_1.AppError('Invalid ticket type specified for this event', 404);
            }
            if (ticketType.soldCount >= ticketType.capacity) {
                throw new appError_1.AppError('Registration failed: Ticket tier is sold out', 400);
            }
            const existingReg = await Registration_1.Registration.findOne({
                userId,
                eventId,
                status: types_1.RegistrationStatus.CONFIRMED,
            });
            if (existingReg) {
                throw new appError_1.AppError('You are already registered for this event with a confirmed ticket', 400);
            }
            const ticketCode = this.generateUniqueTicketCode();
            ticketType.soldCount += 1;
            await ticketType.save();
            const newReg = await Registration_1.Registration.create({
                ticketCode,
                userId,
                eventId,
                ticketTypeId,
                status: types_1.RegistrationStatus.CONFIRMED,
            });
            const user = await User_1.User.findById(userId).select('id name email');
            const regObj = newReg.toJSON();
            const qrCodeUrl = await (0, qrcode_1.generateQRCodeDataUrl)({
                registrationId: regObj.id || regObj._id?.toString(),
                ticketCode: regObj.ticketCode,
                eventId: regObj.eventId,
                eventTitle: event.title,
                attendeeName: user ? user.name : 'Attendee',
                ticketType: ticketType.name,
            });
            return {
                ...regObj,
                event: { id: event.id || event._id?.toString(), title: event.title, venue: event.venue, startDate: event.startDate, endDate: event.endDate },
                ticketType: { id: ticketType.id || ticketType._id?.toString(), name: ticketType.name, price: ticketType.price },
                user: user ? user.toJSON() : null,
                qrCodeUrl,
            };
        }
        else {
            return await prisma_1.prisma.$transaction(async (tx) => {
                const event = await tx.event.findUnique({
                    where: { id: eventId },
                });
                if (!event)
                    throw new appError_1.AppError('Event not found', 404);
                if (event.status !== 'PUBLISHED') {
                    throw new appError_1.AppError(`Cannot register for event with status '${event.status}'`, 400);
                }
                const ticketType = await tx.ticketType.findUnique({
                    where: { id: ticketTypeId },
                });
                if (!ticketType || ticketType.eventId !== eventId) {
                    throw new appError_1.AppError('Invalid ticket type specified for this event', 404);
                }
                if (ticketType.soldCount >= ticketType.capacity) {
                    throw new appError_1.AppError('Registration failed: Ticket tier is sold out', 400);
                }
                const existingReg = await tx.registration.findFirst({
                    where: { userId, eventId, status: types_1.RegistrationStatus.CONFIRMED },
                });
                if (existingReg) {
                    throw new appError_1.AppError('You are already registered for this event with a confirmed ticket', 400);
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
                        status: types_1.RegistrationStatus.CONFIRMED,
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
                const qrCodeUrl = await (0, qrcode_1.generateQRCodeDataUrl)(qrData);
                return { ...registration, qrCodeUrl };
            });
        }
    }
    static async getUserRegistrations(userId) {
        if ((0, db_1.isMongoDB)()) {
            const registrations = await Registration_1.Registration.find({ userId })
                .sort({ createdAt: -1 })
                .populate('eventId', 'title venue startDate endDate category')
                .populate('ticketTypeId', 'name price');
            const results = await Promise.all(registrations.map(async (reg) => {
                const regObj = reg.toJSON();
                const event = regObj.eventId;
                const ticketType = regObj.ticketTypeId;
                delete regObj.eventId;
                delete regObj.ticketTypeId;
                const eventIdStr = event ? (event.id || event._id)?.toString() : '';
                const ticketTypeIdStr = ticketType ? (ticketType.id || ticketType._id)?.toString() : '';
                const qrCodeUrl = await (0, qrcode_1.generateQRCodeDataUrl)({
                    registrationId: regObj.id || regObj._id?.toString(),
                    ticketCode: regObj.ticketCode,
                    eventId: eventIdStr,
                });
                return {
                    ...regObj,
                    event: event ? { id: eventIdStr, title: event.title, venue: event.venue, startDate: event.startDate, endDate: event.endDate, category: event.category } : null,
                    ticketType: ticketType ? { id: ticketTypeIdStr, name: ticketType.name, price: ticketType.price } : null,
                    qrCodeUrl,
                };
            }));
            return results;
        }
        else {
            const registrations = await prisma_1.prisma.registration.findMany({
                where: { userId },
                orderBy: { createdAt: 'desc' },
                include: {
                    event: {
                        select: { id: true, title: true, venue: true, startDate: true, endDate: true, category: true },
                    },
                    ticketType: { select: { id: true, name: true, price: true } },
                },
            });
            const results = await Promise.all(registrations.map(async (reg) => {
                const qrCodeUrl = await (0, qrcode_1.generateQRCodeDataUrl)({
                    registrationId: reg.id,
                    ticketCode: reg.ticketCode,
                    eventId: reg.eventId,
                });
                return { ...reg, qrCodeUrl };
            }));
            return results;
        }
    }
    static async getRegistrationById(registrationId, userId, userRole) {
        if ((0, db_1.isMongoDB)()) {
            const reg = await Registration_1.Registration.findById(registrationId)
                .populate('eventId')
                .populate('ticketTypeId')
                .populate('userId', 'name email');
            if (!reg)
                throw new appError_1.AppError('Registration ticket not found', 404);
            const regObj = reg.toJSON();
            const event = regObj.eventId;
            const user = regObj.userId;
            const ticketType = regObj.ticketTypeId;
            const userIdStr = (user ? (user.id || user._id) : regObj.userId)?.toString();
            const isOwner = userIdStr === userId;
            const isOrganizer = event && event.organizerId && (event.organizerId.id || event.organizerId._id || event.organizerId).toString() === userId;
            const isAdmin = userRole === types_1.Role.ADMIN;
            if (!isOwner && !isOrganizer && !isAdmin) {
                throw new appError_1.AppError('Access denied to this ticket', 403);
            }
            const eventIdStr = event ? (event.id || event._id)?.toString() : '';
            const ticketTypeIdStr = ticketType ? (ticketType.id || ticketType._id)?.toString() : '';
            const qrCodeUrl = await (0, qrcode_1.generateQRCodeDataUrl)({
                registrationId: regObj.id || regObj._id?.toString(),
                ticketCode: regObj.ticketCode,
                eventId: eventIdStr,
                eventTitle: event ? event.title : '',
                attendeeName: user ? user.name : '',
                ticketType: ticketType ? ticketType.name : '',
            });
            return {
                ...regObj,
                event: event ? { id: eventIdStr, title: event.title, venue: event.venue, startDate: event.startDate, endDate: event.endDate } : null,
                ticketType: ticketType ? { id: ticketTypeIdStr, name: ticketType.name, price: ticketType.price } : null,
                user: user ? { id: userIdStr, name: user.name, email: user.email } : null,
                qrCodeUrl,
            };
        }
        else {
            const registration = await prisma_1.prisma.registration.findUnique({
                where: { id: registrationId },
                include: {
                    event: { include: { organizer: { select: { id: true, name: true } } } },
                    ticketType: true,
                    user: { select: { id: true, name: true, email: true } },
                },
            });
            if (!registration)
                throw new appError_1.AppError('Registration ticket not found', 404);
            const isOwner = registration.userId === userId;
            const isOrganizer = registration.event.organizerId === userId;
            const isAdmin = userRole === types_1.Role.ADMIN;
            if (!isOwner && !isOrganizer && !isAdmin) {
                throw new appError_1.AppError('Access denied to this ticket', 403);
            }
            const qrCodeUrl = await (0, qrcode_1.generateQRCodeDataUrl)({
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
    static async cancelRegistration(registrationId, userId, userRole) {
        if ((0, db_1.isMongoDB)()) {
            const reg = await Registration_1.Registration.findById(registrationId);
            if (!reg)
                throw new appError_1.AppError('Registration ticket not found', 404);
            const isOwner = reg.userId.toString() === userId;
            const isAdmin = userRole === types_1.Role.ADMIN;
            if (!isOwner && !isAdmin) {
                throw new appError_1.AppError('You do not have permission to cancel this registration', 403);
            }
            if (reg.status === types_1.RegistrationStatus.CANCELLED) {
                throw new appError_1.AppError('Registration is already cancelled', 400);
            }
            if (reg.status === types_1.RegistrationStatus.ATTENDED) {
                throw new appError_1.AppError('Cannot cancel a ticket that has already been checked-in/attended', 400);
            }
            reg.status = types_1.RegistrationStatus.CANCELLED;
            await reg.save();
            const ticketType = await TicketType_1.TicketType.findById(reg.ticketTypeId);
            if (ticketType && ticketType.soldCount > 0) {
                ticketType.soldCount -= 1;
                await ticketType.save();
            }
            return reg.toJSON();
        }
        else {
            return await prisma_1.prisma.$transaction(async (tx) => {
                const registration = await tx.registration.findUnique({
                    where: { id: registrationId },
                });
                if (!registration)
                    throw new appError_1.AppError('Registration ticket not found', 404);
                const isOwner = registration.userId === userId;
                const isAdmin = userRole === types_1.Role.ADMIN;
                if (!isOwner && !isAdmin) {
                    throw new appError_1.AppError('You do not have permission to cancel this registration', 403);
                }
                if (registration.status === types_1.RegistrationStatus.CANCELLED) {
                    throw new appError_1.AppError('Registration is already cancelled', 400);
                }
                if (registration.status === types_1.RegistrationStatus.ATTENDED) {
                    throw new appError_1.AppError('Cannot cancel a ticket that has already been checked-in/attended', 400);
                }
                const updated = await tx.registration.update({
                    where: { id: registrationId },
                    data: { status: types_1.RegistrationStatus.CANCELLED },
                });
                await tx.ticketType.update({
                    where: { id: registration.ticketTypeId },
                    data: { soldCount: { decrement: 1 } },
                });
                return updated;
            });
        }
    }
    static async checkInAttendee(ticketCode, userId, userRole) {
        if ((0, db_1.isMongoDB)()) {
            const reg = await Registration_1.Registration.findOne({ ticketCode: ticketCode.toUpperCase().trim() })
                .populate('eventId')
                .populate('userId', 'name email')
                .populate('ticketTypeId', 'name');
            if (!reg)
                throw new appError_1.AppError('Invalid ticket code', 404);
            const event = reg.eventId;
            const isOrganizer = event && event.organizerId && (event.organizerId._id || event.organizerId).toString() === userId;
            const isAdmin = userRole === types_1.Role.ADMIN;
            if (!isOrganizer && !isAdmin) {
                throw new appError_1.AppError('You do not have permission to perform check-in for this event', 403);
            }
            if (reg.status === types_1.RegistrationStatus.CANCELLED) {
                throw new appError_1.AppError('Check-in failed: This ticket registration was cancelled', 400);
            }
            if (reg.status === types_1.RegistrationStatus.ATTENDED) {
                throw new appError_1.AppError(`Ticket already checked in at ${reg.checkedInAt?.toISOString()}`, 400);
            }
            reg.status = types_1.RegistrationStatus.ATTENDED;
            reg.checkedInAt = new Date();
            await reg.save();
            const regObj = reg.toJSON();
            const user = regObj.userId;
            const ticketType = regObj.ticketTypeId;
            return {
                ...regObj,
                user: user ? { id: (user.id || user._id)?.toString(), name: user.name, email: user.email } : null,
                event: event ? { id: (event.id || event._id)?.toString(), title: event.title } : null,
                ticketType: ticketType ? { id: (ticketType.id || ticketType._id)?.toString(), name: ticketType.name } : null,
            };
        }
        else {
            const registration = await prisma_1.prisma.registration.findUnique({
                where: { ticketCode },
                include: {
                    event: true,
                    user: { select: { id: true, name: true, email: true } },
                    ticketType: { select: { id: true, name: true } },
                },
            });
            if (!registration)
                throw new appError_1.AppError('Invalid ticket code', 404);
            if (registration.event.organizerId !== userId && userRole !== types_1.Role.ADMIN) {
                throw new appError_1.AppError('You do not have permission to perform check-in for this event', 403);
            }
            if (registration.status === types_1.RegistrationStatus.CANCELLED) {
                throw new appError_1.AppError('Check-in failed: This ticket registration was cancelled', 400);
            }
            if (registration.status === types_1.RegistrationStatus.ATTENDED) {
                throw new appError_1.AppError(`Ticket already checked in at ${registration.checkedInAt?.toISOString()}`, 400);
            }
            const updated = await prisma_1.prisma.registration.update({
                where: { ticketCode },
                data: {
                    status: types_1.RegistrationStatus.ATTENDED,
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
exports.RegistrationService = RegistrationService;
