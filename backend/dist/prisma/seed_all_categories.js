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
async function seedAllCategories() {
    await (0, db_1.connectDB)();
    console.log('🧹 Clearing old data...');
    await Registration_1.Registration.deleteMany({});
    await TicketType_1.TicketType.deleteMany({});
    await Event_1.Event.deleteMany({});
    await User_1.User.deleteMany({});
    console.log('✨ Creating default accounts (Admin, Organizer, Attendee)...');
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
    console.log('🚀 Seeding 36 high-quality events (6 per category)...');
    const items = [
        // --- 1. MOVIES (6 items) ---
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
            venue: 'Regal Cinema - Screen 3',
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
                { name: 'Standard Pass', price: 14.99, capacity: 200 },
                { name: 'VIP Pass', price: 29.99, capacity: 50 },
            ],
        },
        {
            title: 'Oppenheimer',
            description: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.',
            category: 'Movies',
            venue: 'AMC Starlight IMAX Theater - Screen 2',
            startDate: new Date('2026-09-15T19:30:00Z'),
            endDate: new Date('2026-09-15T22:30:00Z'),
            status: 'PUBLISHED',
            organizerId: organizer._id,
            ticketTiers: [
                { name: 'Standard Pass', price: 13.50, capacity: 120 },
                { name: 'VIP Pass', price: 26.50, capacity: 30 },
            ],
        },
        {
            title: 'Avatar: The Way of Water',
            description: 'Jake Sully lives with his newfound family formed on the extrasolar moon Pandora. Once a familiar threat returns, Jake must work with Neytiri and the Na\'vi army to protect their home.',
            category: 'Movies',
            venue: 'Regal 3D Theater - Screen 4',
            startDate: new Date('2026-09-20T17:00:00Z'),
            endDate: new Date('2026-09-20T20:15:00Z'),
            status: 'PUBLISHED',
            organizerId: organizer._id,
            ticketTiers: [
                { name: 'Standard 3D Pass', price: 15.99, capacity: 180 },
                { name: 'VIP 3D Recliner Pass', price: 32.00, capacity: 40 },
            ],
        },
        {
            title: 'Pulp Fiction',
            description: 'The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.',
            category: 'Movies',
            venue: 'Classic Film Society & Theater',
            startDate: new Date('2026-09-25T21:00:00Z'),
            endDate: new Date('2026-09-25T23:35:00Z'),
            status: 'PUBLISHED',
            organizerId: organizer._id,
            ticketTiers: [
                { name: 'General Pass', price: 11.00, capacity: 100 },
                { name: 'Balcony Seat Pass', price: 20.00, capacity: 30 },
            ],
        },
        // --- 2. TECHNOLOGY (6 items) ---
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
        {
            title: 'Cybersecurity & Ethical Hacking Symposium',
            description: 'Deep dive into zero-day vulnerability analysis, penetration testing, cloud security hardening, and incident response.',
            category: 'Technology',
            venue: 'Boston Innovation Hub',
            startDate: new Date('2026-11-08T09:00:00Z'),
            endDate: new Date('2026-11-09T17:00:00Z'),
            status: 'PUBLISHED',
            organizerId: organizer._id,
            ticketTiers: [
                { name: 'Standard Pass', price: 89.99, capacity: 300 },
                { name: 'VIP Security Pass', price: 249.99, capacity: 50 },
            ],
        },
        {
            title: 'Quantum Computing & Next-Gen Hardware Forum',
            description: 'Investigate superconducting qubits, quantum cryptography, photonics, and error-correcting quantum algorithms.',
            category: 'Technology',
            venue: 'Austin Convention Center',
            startDate: new Date('2026-11-15T09:30:00Z'),
            endDate: new Date('2026-11-16T16:30:00Z'),
            status: 'PUBLISHED',
            organizerId: organizer._id,
            ticketTiers: [
                { name: 'Research Pass', price: 120.00, capacity: 250 },
                { name: 'Industry VIP Pass', price: 350.00, capacity: 40 },
            ],
        },
        {
            title: 'Full-Stack Web Development & Frameworks Expo',
            description: 'Master modern frontend & backend architectures, Next.js, Vite, Node.js microservices, and GraphQL APIs.',
            category: 'Technology',
            venue: 'New York Tech Center',
            startDate: new Date('2026-11-20T10:00:00Z'),
            endDate: new Date('2026-11-21T18:00:00Z'),
            status: 'PUBLISHED',
            organizerId: organizer._id,
            ticketTiers: [
                { name: 'Standard Pass', price: 69.99, capacity: 350 },
                { name: 'VIP Pass', price: 179.99, capacity: 60 },
            ],
        },
        {
            title: 'Robotics & Autonomous Systems World Conference',
            description: 'Examine humanoid robotics, SLAM navigation, drone logistics, and AI-driven industrial automation.',
            category: 'Technology',
            venue: 'Silicon Valley Expo Center',
            startDate: new Date('2026-12-01T09:00:00Z'),
            endDate: new Date('2026-12-03T17:00:00Z'),
            status: 'PUBLISHED',
            organizerId: organizer._id,
            ticketTiers: [
                { name: 'Standard Pass', price: 110.00, capacity: 450 },
                { name: 'VIP Pass', price: 280.00, capacity: 70 },
            ],
        },
        // --- 3. MUSIC (6 items) ---
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
        {
            title: 'Electronic Dance Music (EDM) Live World Tour',
            description: 'A high-energy electronic music spectacle featuring top international DJs, laser lighting, and 360-degree surround sound.',
            category: 'Music',
            venue: 'Neon Arena & Stadium',
            startDate: new Date('2026-11-05T20:00:00Z'),
            endDate: new Date('2026-11-06T04:00:00Z'),
            status: 'PUBLISHED',
            organizerId: organizer._id,
            ticketTiers: [
                { name: 'General Standing Pass', price: 69.99, capacity: 1500 },
                { name: 'VIP Stage Pass', price: 199.99, capacity: 200 },
            ],
        },
        {
            title: 'International Jazz & Blues Masters Night',
            description: 'Enjoy soulful saxophone, brass ensembles, and blues guitar improvisations from legendary musicians.',
            category: 'Music',
            venue: 'Blue Note Jazz Club & Concert Hall',
            startDate: new Date('2026-11-12T19:00:00Z'),
            endDate: new Date('2026-11-12T23:00:00Z'),
            status: 'PUBLISHED',
            organizerId: organizer._id,
            ticketTiers: [
                { name: 'Standard Club Pass', price: 39.99, capacity: 200 },
                { name: 'VIP Table Pass', price: 95.00, capacity: 40 },
            ],
        },
        {
            title: 'Rock & Metal Mayhem Live Festival 2026',
            description: 'An explosive heavy rock festival with iconic headlining bands, pyrotechnics, and live outdoor stages.',
            category: 'Music',
            venue: 'Red Rocks Amphitheatre',
            startDate: new Date('2026-11-18T17:00:00Z'),
            endDate: new Date('2026-11-19T01:00:00Z'),
            status: 'PUBLISHED',
            organizerId: organizer._id,
            ticketTiers: [
                { name: 'General Admission', price: 55.00, capacity: 1200 },
                { name: 'VIP Pit Pass', price: 165.00, capacity: 100 },
            ],
        },
        {
            title: 'Indie Folk & Acoustic Singer-Songwriter Showcase',
            description: 'An intimate evening of acoustic guitars, vocal harmonies, and original indie storytelling.',
            category: 'Music',
            venue: 'Riverside Music Pavilion',
            startDate: new Date('2026-11-25T18:30:00Z'),
            endDate: new Date('2026-11-25T22:00:00Z'),
            status: 'PUBLISHED',
            organizerId: organizer._id,
            ticketTiers: [
                { name: 'General Seat Pass', price: 29.99, capacity: 300 },
                { name: 'VIP Front Row Pass', price: 75.00, capacity: 50 },
            ],
        },
        {
            title: 'Global Pop Stars World Arena Concert',
            description: 'A spectacular stadium concert event featuring global chart-topping pop icons, choreography, and visual effects.',
            category: 'Music',
            venue: 'Madison Square Garden',
            startDate: new Date('2026-12-05T19:30:00Z'),
            endDate: new Date('2026-12-05T23:00:00Z'),
            status: 'PUBLISHED',
            organizerId: organizer._id,
            ticketTiers: [
                { name: 'Arena Pass', price: 85.00, capacity: 2500 },
                { name: 'VIP Golden Circle Pass', price: 275.00, capacity: 250 },
            ],
        },
        // --- 4. BUSINESS (6 items) ---
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
        {
            title: 'Fintech & Blockchain Innovations Conference',
            description: 'Discover decentralized finance, digital banking regulations, automated compliance, and cross-border payments.',
            category: 'Business',
            venue: 'London International Finance Hub',
            startDate: new Date('2026-11-16T09:00:00Z'),
            endDate: new Date('2026-11-17T17:00:00Z'),
            status: 'PUBLISHED',
            organizerId: organizer._id,
            ticketTiers: [
                { name: 'Conference Pass', price: 175.00, capacity: 400 },
                { name: 'VIP Executive Pass', price: 420.00, capacity: 60 },
            ],
        },
        {
            title: 'Modern Healthcare & Digital MedTech Expo',
            description: 'Leading medical professionals, biotech researchers, and healthcare executives present digital health innovations.',
            category: 'Business',
            venue: 'Chicago Trade & Convention Center',
            startDate: new Date('2026-11-22T09:00:00Z'),
            endDate: new Date('2026-11-24T17:00:00Z'),
            status: 'PUBLISHED',
            organizerId: organizer._id,
            ticketTiers: [
                { name: 'Delegate Pass', price: 150.00, capacity: 500 },
                { name: 'VIP Executive Pass', price: 380.00, capacity: 80 },
            ],
        },
        {
            title: 'Real Estate & Commercial Development Summit',
            description: 'Insights into global property investment trends, smart building technology, and sustainable architectural development.',
            category: 'Business',
            venue: 'Miami Grand Hotel & Resort',
            startDate: new Date('2026-12-02T09:00:00Z'),
            endDate: new Date('2026-12-03T18:00:00Z'),
            status: 'PUBLISHED',
            organizerId: organizer._id,
            ticketTiers: [
                { name: 'Standard Pass', price: 210.00, capacity: 350 },
                { name: 'VIP Investor Pass', price: 550.00, capacity: 50 },
            ],
        },
        {
            title: 'Global Supply Chain & E-Commerce Logistics Forum',
            description: 'Strategies for global freight optimization, warehouse robotics, automated inventory, and last-mile delivery.',
            category: 'Business',
            venue: 'Dubai World Trade Centre',
            startDate: new Date('2026-12-08T09:00:00Z'),
            endDate: new Date('2026-12-09T17:30:00Z'),
            status: 'PUBLISHED',
            organizerId: organizer._id,
            ticketTiers: [
                { name: 'Delegate Pass', price: 185.00, capacity: 450 },
                { name: 'VIP Executive Pass', price: 460.00, capacity: 70 },
            ],
        },
        {
            title: 'Executive Leadership & Business Strategy Summit',
            description: 'High-level C-suite discussions on corporate transformation, crisis management, organizational growth, and ESG policies.',
            category: 'Business',
            venue: 'Singapore Marina Bay Sands',
            startDate: new Date('2026-12-14T08:30:00Z'),
            endDate: new Date('2026-12-15T18:00:00Z'),
            status: 'PUBLISHED',
            organizerId: organizer._id,
            ticketTiers: [
                { name: 'Executive Pass', price: 295.00, capacity: 250 },
                { name: 'C-Suite VIP Pass', price: 695.00, capacity: 40 },
            ],
        },
        // --- 5. SPORTS (6 items) ---
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
        {
            title: 'International Grand Slam Tennis Tournament',
            description: 'Watch top world-ranked tennis players compete in thrilling singles and doubles matches.',
            category: 'Sports',
            venue: 'National Tennis Center Court 1',
            startDate: new Date('2026-10-12T10:00:00Z'),
            endDate: new Date('2026-10-14T20:00:00Z'),
            status: 'PUBLISHED',
            organizerId: organizer._id,
            ticketTiers: [
                { name: 'Stadium Seat Pass', price: 75.00, capacity: 1500 },
                { name: 'Courtside VIP Pass', price: 250.00, capacity: 100 },
            ],
        },
        {
            title: 'Global Esports Championship & Gaming Expo',
            description: 'World-class esports teams compete live for a $1M prize pool, featuring gaming hardware showcases and cosplay contests.',
            category: 'Sports',
            venue: 'Los Angeles Staples Arena',
            startDate: new Date('2026-10-25T11:00:00Z'),
            endDate: new Date('2026-10-27T22:00:00Z'),
            status: 'PUBLISHED',
            organizerId: organizer._id,
            ticketTiers: [
                { name: 'Gamer Day Pass', price: 45.00, capacity: 3000 },
                { name: 'VIP Weekend Pass', price: 125.00, capacity: 300 },
            ],
        },
        {
            title: 'World Extreme Mountain Biking & Outdoor Challenge',
            description: 'Watch downhill mountain bike racers navigate steep mountain drops and technical obstacle tracks.',
            category: 'Sports',
            venue: 'Alpine Adventure Park',
            startDate: new Date('2026-11-02T08:00:00Z'),
            endDate: new Date('2026-11-03T17:00:00Z'),
            status: 'PUBLISHED',
            organizerId: organizer._id,
            ticketTiers: [
                { name: 'General Access Pass', price: 35.00, capacity: 800 },
                { name: 'VIP Spectator Pass', price: 85.00, capacity: 100 },
            ],
        },
        {
            title: 'National Basketball All-Star Exhibition Night',
            description: 'A high-scoring basketball exhibition game featuring dunk contests, 3-point shootouts, and celebrity halftime shows.',
            category: 'Sports',
            venue: 'Downtown Basketball Center',
            startDate: new Date('2026-11-14T19:00:00Z'),
            endDate: new Date('2026-11-14T22:30:00Z'),
            status: 'PUBLISHED',
            organizerId: organizer._id,
            ticketTiers: [
                { name: 'Upper Deck Pass', price: 40.00, capacity: 2000 },
                { name: 'Courtside VIP Pass', price: 210.00, capacity: 80 },
            ],
        },
        {
            title: 'International Professional Boxing Heavyweight Clash',
            description: 'Undefeated heavyweight contenders square off in a 12-round championship fight night.',
            category: 'Sports',
            venue: 'Las Vegas Grand Arena',
            startDate: new Date('2026-11-28T20:00:00Z'),
            endDate: new Date('2026-11-28T23:45:00Z'),
            status: 'PUBLISHED',
            organizerId: organizer._id,
            ticketTiers: [
                { name: 'Arena Seat Pass', price: 95.00, capacity: 1800 },
                { name: 'Ringside VIP Pass', price: 450.00, capacity: 120 },
            ],
        },
        // --- 6. DESIGN (6 items) ---
        {
            title: 'UI/UX Design Systems & Product Conference 2026',
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
        {
            title: '3D Animation, VFX & Interactive Game Design Summit',
            description: 'Keynotes on Unreal Engine 5, Blender 3D pipelines, real-time ray tracing, and character animation techniques.',
            category: 'Design',
            venue: 'Los Angeles Creative Studios',
            startDate: new Date('2026-11-21T10:00:00Z'),
            endDate: new Date('2026-11-23T18:00:00Z'),
            status: 'PUBLISHED',
            organizerId: organizer._id,
            ticketTiers: [
                { name: 'Creative Pass', price: 95.00, capacity: 350 },
                { name: 'VIP Studio Pass', price: 260.00, capacity: 60 },
            ],
        },
        {
            title: 'Global Architecture & Sustainable Urban Planning Expo',
            description: 'Discover eco-friendly building materials, smart city urban designs, biophilic architecture, and zero-carbon structures.',
            category: 'Design',
            venue: 'Berlin Design Academy',
            startDate: new Date('2026-11-27T09:00:00Z'),
            endDate: new Date('2026-11-29T17:00:00Z'),
            status: 'PUBLISHED',
            organizerId: organizer._id,
            ticketTiers: [
                { name: 'Architect Pass', price: 115.00, capacity: 400 },
                { name: 'VIP Executive Pass', price: 310.00, capacity: 50 },
            ],
        },
        {
            title: 'Modern Typography & Brand Identity Workshop',
            description: 'An interactive hands-on workshop covering variable font design, brand storytelling, and visual identity systems.',
            category: 'Design',
            venue: 'Tokyo Art & Design Hub',
            startDate: new Date('2026-12-04T10:00:00Z'),
            endDate: new Date('2026-12-05T17:00:00Z'),
            status: 'PUBLISHED',
            organizerId: organizer._id,
            ticketTiers: [
                { name: 'Workshop Pass', price: 75.00, capacity: 150 },
                { name: 'VIP Portfolio Review Pass', price: 185.00, capacity: 25 },
            ],
        },
        {
            title: 'Industrial Product & Hardware Design Symposium',
            description: 'Explore ergonomics, CAD modeling, rapid 3D prototyping, circular manufacturing, and consumer hardware design.',
            category: 'Design',
            venue: 'Milan Fashion & Design Center',
            startDate: new Date('2026-12-10T09:30:00Z'),
            endDate: new Date('2026-12-11T17:30:00Z'),
            status: 'PUBLISHED',
            organizerId: organizer._id,
            ticketTiers: [
                { name: 'Standard Pass', price: 105.00, capacity: 300 },
                { name: 'VIP Pass', price: 275.00, capacity: 40 },
            ],
        },
        {
            title: 'Interactive Web Experience & Creative Coding Summit',
            description: 'Explore WebGL shaders, Three.js, Canvas 2D graphics, GSAP animations, and interactive generative web art.',
            category: 'Design',
            venue: 'Amsterdam Digital Art Space',
            startDate: new Date('2026-12-16T10:00:00Z'),
            endDate: new Date('2026-12-17T18:00:00Z'),
            status: 'PUBLISHED',
            organizerId: organizer._id,
            ticketTiers: [
                { name: 'Developer & Designer Pass', price: 85.00, capacity: 350 },
                { name: 'VIP Pass', price: 210.00, capacity: 50 },
            ],
        },
    ];
    for (const item of items) {
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
    console.log(`✅ Successfully seeded ${items.length} curated events across all 6 categories (6 events per category)! 🎉`);
    process.exit(0);
}
seedAllCategories();
