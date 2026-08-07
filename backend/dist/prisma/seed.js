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
const prisma_1 = require("../config/prisma");
async function main() {
    await (0, db_1.connectDB)();
    console.log('Seeding database with sample users and 10+ professional events...');
    const hashedPassword = await bcryptjs_1.default.hash('password123', 10);
    const sampleEventsData = [
        {
            title: 'Global AI & Deep Learning Summit 2026',
            description: 'Explore state-of-the-art breakthroughs in generative AI, large language models, autonomous agent frameworks, and neural networks with keynote speakers from top AI labs.',
            category: 'Technology',
            venue: 'San Francisco Convention Center, Hall A',
            startDate: new Date('2026-09-15T09:00:00Z'),
            endDate: new Date('2026-09-17T18:00:00Z'),
            ticketTypes: [
                { name: 'Early Bird Pass', price: 149.99, capacity: 100 },
                { name: 'General Admission', price: 299.99, capacity: 500 },
                { name: 'VIP All-Access Pass', price: 699.99, capacity: 50 },
            ],
        },
        {
            title: 'International Cloud & Microservices Expo',
            description: 'Master Kubernetes, serverless architectures, multi-cloud DevOps pipelines, and enterprise security strategy with live interactive workshops.',
            category: 'Technology',
            venue: 'Seattle Tech Pavilion, Main Arena',
            startDate: new Date('2026-10-05T08:30:00Z'),
            endDate: new Date('2026-10-07T17:00:00Z'),
            ticketTypes: [
                { name: 'Developer Pass', price: 99.00, capacity: 300 },
                { name: 'Enterprise Architect Pass', price: 349.00, capacity: 150 },
            ],
        },
        {
            title: 'Symphonic Music & Arts Outdoor Festival',
            description: 'An open-air multi-stage music festival featuring world-renowned orchestras, acoustic indie sets, electronic lightshows, and visual art installations.',
            category: 'Music',
            venue: 'Golden Gate Park, San Francisco, CA',
            startDate: new Date('2026-08-20T12:00:00Z'),
            endDate: new Date('2026-08-22T23:00:00Z'),
            ticketTypes: [
                { name: 'Weekend Standard Pass', price: 89.00, capacity: 1000 },
                { name: 'VIP Backstage Lounge Pass', price: 249.00, capacity: 100 },
            ],
        },
        {
            title: 'Electronic Dance Music (EDM) Live World Tour',
            description: 'Experience an unforgettable night with top global DJs, high-octane lasers, immersive spatial audio systems, and live pyrotechnic performances.',
            category: 'Music',
            venue: 'Madison Square Garden, New York, NY',
            startDate: new Date('2026-11-12T20:00:00Z'),
            endDate: new Date('2026-11-13T02:00:00Z'),
            ticketTypes: [
                { name: 'Standard Dance Floor', price: 75.00, capacity: 2000 },
                { name: 'Front Stage VIP Pit', price: 180.00, capacity: 300 },
            ],
        },
        {
            title: 'Global Venture Capital & Founder Forum 2026',
            description: 'Connect startup founders with leading angel investors and Series A-C venture capitalists. Features live pitch competitions, funding panels, and networking lounges.',
            category: 'Business',
            venue: 'The Ritz-Carlton Financial Center, Chicago',
            startDate: new Date('2026-09-28T09:00:00Z'),
            endDate: new Date('2026-09-29T18:00:00Z'),
            ticketTypes: [
                { name: 'Startup Founder Pass', price: 199.00, capacity: 150 },
                { name: 'Investor Pass', price: 499.00, capacity: 75 },
            ],
        },
        {
            title: 'Fintech & Blockchain Innovations Conference',
            description: 'Discover the future of digital banking, decentralized finance (DeFi), real-time payment rails, and global regulatory compliance frameworks.',
            category: 'Business',
            venue: 'London International Financial Hub',
            startDate: new Date('2026-10-18T09:30:00Z'),
            endDate: new Date('2026-10-20T17:30:00Z'),
            ticketTypes: [
                { name: 'Standard Conference Pass', price: 299.00, capacity: 400 },
                { name: 'Executive VIP Pass', price: 799.00, capacity: 50 },
            ],
        },
        {
            title: 'World Marathon & Endurance Championship 2026',
            description: 'Join elite distance runners and fitness enthusiasts in a landmark citywide 42km marathon with live tracking, hydration stations, and finisher awards.',
            category: 'Sports',
            venue: 'Boston Waterfront Marathon Course',
            startDate: new Date('2026-10-10T06:00:00Z'),
            endDate: new Date('2026-10-10T15:00:00Z'),
            ticketTypes: [
                { name: 'Marathon Entry Bib', price: 60.00, capacity: 5000 },
                { name: 'Spectator VIP Grandstand', price: 35.00, capacity: 500 },
            ],
        },
        {
            title: 'UI/UX Design Systems & Product Conference',
            description: 'Learn modern component design architecture, accessible UI patterns, micro-interaction motion design, and product management workflows from design leaders.',
            category: 'Design',
            venue: 'Design Center Auditorium, Austin, TX',
            startDate: new Date('2026-09-02T09:00:00Z'),
            endDate: new Date('2026-09-03T17:00:00Z'),
            ticketTypes: [
                { name: 'Designer Pass', price: 129.00, capacity: 250 },
                { name: 'Design Workshop Pass', price: 249.00, capacity: 80 },
            ],
        },
        {
            title: 'Cybersecurity & Ethical Hacking Symposium',
            description: 'Hands-on capture-the-flag (CTF) competitions, zero-trust network defense tactics, vulnerability research, and threat intelligence analysis.',
            category: 'Technology',
            venue: 'Cyber Security Institute, Washington D.C.',
            startDate: new Date('2026-11-04T08:30:00Z'),
            endDate: new Date('2026-11-06T18:00:00Z'),
            ticketTypes: [
                { name: 'Attendee Pass', price: 175.00, capacity: 350 },
                { name: 'CTF Competitor Pass', price: 220.00, capacity: 100 },
            ],
        },
        {
            title: 'Modern Healthcare & Digital MedTech Expo',
            description: 'Showcasing groundbreaking medical technology, AI diagnostics, remote patient monitoring devices, and genomic health innovations.',
            category: 'Business',
            venue: 'Boston Medical Innovation Center',
            startDate: new Date('2026-11-18T09:00:00Z'),
            endDate: new Date('2026-11-20T17:00:00Z'),
            ticketTypes: [
                { name: 'Professional Pass', price: 190.00, capacity: 400 },
                { name: 'Exhibitor Booth Pass', price: 850.00, capacity: 30 },
            ],
        },
    ];
    if ((0, db_1.isMongoDB)()) {
        // 1. Create Demo Users in MongoDB
        async function getOrCreateMongoUser(name, email, role) {
            let u = await User_1.User.findOne({ email });
            if (!u) {
                u = await User_1.User.create({ name, email, password: hashedPassword, role });
            }
            return u;
        }
        const admin = await getOrCreateMongoUser('System Admin', 'admin@eventapi.com', 'ADMIN');
        const organizer = await getOrCreateMongoUser('Sarah Organizer', 'organizer@eventapi.com', 'ORGANIZER');
        const attendee = await getOrCreateMongoUser('Bob Attendee', 'attendee@eventapi.com', 'ATTENDEE');
        console.log(`Created sample users in MongoDB Compass: Admin (${admin.email}), Organizer (${organizer.email}), Attendee (${attendee.email})`);
        // Clean existing events & ticket types to ensure fresh 10+ professional events
        await TicketType_1.TicketType.deleteMany({});
        await Event_1.Event.deleteMany({});
        for (const item of sampleEventsData) {
            const { ticketTypes, ...eventFields } = item;
            const ev = await Event_1.Event.create({
                ...eventFields,
                status: 'PUBLISHED',
                organizerId: organizer._id,
            });
            await TicketType_1.TicketType.insertMany(ticketTypes.map((t) => ({
                eventId: ev._id,
                name: t.name,
                price: t.price,
                capacity: t.capacity,
            })));
        }
        const count = await Event_1.Event.countDocuments();
        console.log(`Successfully seeded ${count} professional events into MongoDB Compass! 🚀`);
    }
    else {
        // SQLite Fallback
        const organizer = await prisma_1.prisma.user.upsert({
            where: { email: 'organizer@eventapi.com' },
            update: {},
            create: { name: 'Sarah Organizer', email: 'organizer@eventapi.com', password: hashedPassword, role: 'ORGANIZER' },
        });
        await prisma_1.prisma.ticketType.deleteMany({});
        await prisma_1.prisma.event.deleteMany({});
        for (const item of sampleEventsData) {
            const { ticketTypes, ...eventFields } = item;
            await prisma_1.prisma.event.create({
                data: {
                    ...eventFields,
                    status: 'PUBLISHED',
                    organizerId: organizer.id,
                    ticketTypes: {
                        create: ticketTypes,
                    },
                },
            });
        }
        const count = await prisma_1.prisma.event.count();
        console.log(`Successfully seeded ${count} professional events into SQLite! 🚀`);
    }
    console.log('Database seeding completed successfully! 🎉');
    process.exit(0);
}
main().catch((e) => {
    console.error('Seeding failed:', e);
    process.exit(1);
});
