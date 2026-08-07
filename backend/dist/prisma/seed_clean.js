"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const db_1 = require("../config/db");
const User_1 = require("../models/User");
const Event_1 = require("../models/Event");
const TicketType_1 = require("../models/TicketType");
const Registration_1 = require("../models/Registration");
const mongoose_1 = __importDefault(require("mongoose"));
async function seedCleanDatabase() {
    await (0, db_1.connectDB)();
    console.log('🧹 Cleaning database collections...');
    // Delete all existing documents from core collections
    await Registration_1.Registration.deleteMany({});
    await TicketType_1.TicketType.deleteMany({});
    await Event_1.Event.deleteMany({});
    await User_1.User.deleteMany({});
    // Drop extra movies collection if exists to keep database clean
    if (mongoose_1.default.connection.db) {
        try {
            await mongoose_1.default.connection.db.dropCollection('movies');
            console.log('Deleted extra movies collection for a clean database structure.');
        }
        catch (e) { }
    }
    console.log('✨ Creating essential seed users (Admin, Organizer, Attendee)...');
    const passwordHash = await bcryptjs_1.default.hash('Password123!', 10);
    const admin = await User_1.User.create({
        name: 'Admin User',
        email: 'admin@eventapi.com',
        password: passwordHash,
        role: 'ADMIN',
    });
    const organizer = await User_1.User.create({
        name: 'Sarah Connor (Organizer)',
        email: 'organizer@eventapi.com',
        password: passwordHash,
        role: 'ORGANIZER',
    });
    const attendee = await User_1.User.create({
        name: 'Alex Morgan (Attendee)',
        email: 'attendee@eventapi.com',
        password: passwordHash,
        role: 'ATTENDEE',
    });
    console.log('🚀 Seeding curated clean items across all categories...');
    const cleanItems = [
        // MOVIES CATEGORY
        {
            title: 'The Dark Knight',
            description: 'When the menace known as the Joker wreaks havoc and chaos on Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
            category: 'Movies',
            venue: 'AMC Starlight IMAX Theater - Screen 1',
            startDate: new Date('2026-09-01T19:00:00Z'),
            endDate: new Date('2026-09-01T21:30:00Z'),
            status: 'PUBLISHED',
            organizerId: organizer._id,
            ticketTiers: [
                { name: 'Standard Cinema Pass', price: 12.99, capacity: 150 },
                { name: 'VIP Recliner Pass', price: 24.99, capacity: 40 },
            ],
        },
        {
            title: 'Inception',
            description: 'A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
            category: 'Movies',
            venue: 'AMC Starlight IMAX Theater - Screen 3',
            startDate: new Date('2026-09-05T20:00:00Z'),
            endDate: new Date('2026-09-05T22:30:00Z'),
            status: 'PUBLISHED',
            organizerId: organizer._id,
            ticketTiers: [
                { name: 'Standard Cinema Pass', price: 12.99, capacity: 150 },
                { name: 'VIP Recliner Pass', price: 24.99, capacity: 40 },
            ],
        },
        {
            title: 'Interstellar',
            description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
            category: 'Movies',
            venue: 'Omnimax Dome Cinema - Auditorium A',
            startDate: new Date('2026-09-10T18:30:00Z'),
            endDate: new Date('2026-09-10T21:20:00Z'),
            status: 'PUBLISHED',
            organizerId: organizer._id,
            ticketTiers: [
                { name: 'Standard Cinema Pass', price: 14.99, capacity: 200 },
                { name: 'VIP Recliner Pass', price: 29.99, capacity: 50 },
            ],
        },
        {
            title: 'Oppenheimer',
            description: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.',
            category: 'Movies',
            venue: 'Regal Premium Cinema - Screen 5',
            startDate: new Date('2026-09-15T19:30:00Z'),
            endDate: new Date('2026-09-15T22:30:00Z'),
            status: 'PUBLISHED',
            organizerId: organizer._id,
            ticketTiers: [
                { name: 'Standard Pass', price: 13.50, capacity: 120 },
                { name: 'VIP Pass', price: 26.50, capacity: 30 },
            ],
        },
        // TECHNOLOGY CATEGORY
        {
            title: 'Global AI & Deep Learning Summit 2026',
            description: 'Explore state-of-the-art breakthroughs in generative AI, large language models, autonomous agents, and neural architectures.',
            category: 'Technology',
            venue: 'San Francisco Convention Center, Hall A',
            startDate: new Date('2026-10-15T09:00:00Z'),
            endDate: new Date('2026-10-17T18:00:00Z'),
            status: 'PUBLISHED',
            organizerId: organizer._id,
            ticketTiers: [
                { name: 'General Pass', price: 99.99, capacity: 500 },
                { name: 'VIP Executive Pass', price: 299.99, capacity: 100 },
            ],
        },
        {
            title: 'International Cloud & Microservices Expo',
            description: 'A global gathering of cloud architects, DevOps engineers, Kubernetes maintainers, and distributed system leaders.',
            category: 'Technology',
            venue: 'Seattle Tech Pavilion',
            startDate: new Date('2026-11-01T09:00:00Z'),
            endDate: new Date('2026-11-03T17:00:00Z'),
            status: 'PUBLISHED',
            organizerId: organizer._id,
            ticketTiers: [
                { name: 'Developer Pass', price: 79.99, capacity: 400 },
                { name: 'VIP Pass', price: 199.99, capacity: 80 },
            ],
        },
        // MUSIC CATEGORY
        {
            title: 'Symphonic Music & Arts Outdoor Festival',
            description: 'An immersive weekend featuring world-renowned orchestral conductors, acoustic soloists, and interactive digital light art installations.',
            category: 'Music',
            venue: 'Metropolitan Central Park Amphitheater',
            startDate: new Date('2026-10-20T16:00:00Z'),
            endDate: new Date('2026-10-22T23:00:00Z'),
            status: 'PUBLISHED',
            organizerId: organizer._id,
            ticketTiers: [
                { name: 'Lawn Pass', price: 49.99, capacity: 1000 },
                { name: 'Front Row VIP Pass', price: 149.99, capacity: 150 },
            ],
        },
        // BUSINESS CATEGORY
        {
            title: 'Global Venture Capital & Founder Forum 2026',
            description: 'Connect top-tier venture capitalists, angel investors, and high-growth startup founders for keynotes and pitch sessions.',
            category: 'Business',
            venue: 'Financial Center Grand Ballroom',
            startDate: new Date('2026-11-10T08:30:00Z'),
            endDate: new Date('2026-11-11T18:00:00Z'),
            status: 'PUBLISHED',
            organizerId: organizer._id,
            ticketTiers: [
                { name: 'Attendee Pass', price: 199.99, capacity: 300 },
                { name: 'Investor VIP Pass', price: 499.99, capacity: 50 },
            ],
        },
        // SPORTS CATEGORY
        {
            title: 'World Marathon & Endurance Championship 2026',
            description: 'Join elite marathoners and endurance athletes for a scenic 42.2 km course through city landmarks.',
            category: 'Sports',
            venue: 'City Olympic Stadium & Marathon Route',
            startDate: new Date('2026-10-05T06:00:00Z'),
            endDate: new Date('2026-10-05T14:00:00Z'),
            status: 'PUBLISHED',
            organizerId: organizer._id,
            ticketTiers: [
                { name: 'Runner Entry Pass', price: 65.00, capacity: 2000 },
                { name: 'Spectator VIP Pass', price: 25.00, capacity: 500 },
            ],
        },
        // DESIGN CATEGORY
        {
            title: 'UI/UX Design Systems & Product Conference',
            description: 'Learn modern design tokens, accessible component libraries, motion design, and user research strategies from industry design leaders.',
            category: 'Design',
            venue: 'Design Center Auditorium',
            startDate: new Date('2026-11-15T09:30:00Z'),
            endDate: new Date('2026-11-16T17:30:00Z'),
            status: 'PUBLISHED',
            organizerId: organizer._id,
            ticketTiers: [
                { name: 'Design Pass', price: 89.99, capacity: 250 },
                { name: 'Masterclass VIP Pass', price: 229.99, capacity: 40 },
            ],
        },
    ];
    for (const item of cleanItems) {
        const { ticketTiers, ...eventFields } = item;
        const createdEv = await Event_1.Event.create(eventFields);
        await TicketType_1.TicketType.insertMany(ticketTiers.map((t) => ({
            eventId: createdEv._id,
            name: t.name,
            price: t.price,
            capacity: t.capacity,
            soldCount: 0,
        })));
    }
    console.log(`✅ Clean database setup completed successfully! (${cleanItems.length} curated events & movies seeded across 4 clean collections) 🎉`);
    process.exit(0);
}
seedCleanDatabase();
