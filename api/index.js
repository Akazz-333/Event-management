const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const ATLAS_URI = 'mongodb+srv://akazz33333_db_user:sb25102004@cluster0.3gnbcqu.mongodb.net/event_management_db?retryWrites=true&w=majority&appName=Cluster0';
const JWT_SECRET = 'eventhub_super_secret_jwt_key_2026_safe_and_secure';

let isConnected = false;

async function initDB() {
  if (isConnected && mongoose.connection.readyState === 1) return;
  try {
    await mongoose.connect(ATLAS_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
  } catch (e) {
    console.error('Mongo connection error:', e);
  }
}

// User Schema & Model
const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['ATTENDEE', 'ORGANIZER', 'ADMIN'], default: 'ATTENDEE' },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model('User', UserSchema);

// Registration Schema & Model
const RegistrationSchema = new mongoose.Schema(
  {
    ticketCode: { type: String, required: true, unique: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    eventId: { type: String, required: true },
    ticketTypeId: { type: String },
    status: { type: String, enum: ['CONFIRMED', 'CHECKED_IN', 'CANCELLED'], default: 'CONFIRMED' },
    checkedInAt: { type: Date },
  },
  { timestamps: true }
);

const Registration = mongoose.models.Registration || mongoose.model('Registration', RegistrationSchema);

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  await initDB();

  const url = req.url || '';

  // 1. Authentication (Login / Register)
  if (url.includes('/auth')) {
    try {
      let body = req.body;
      if (typeof body === 'string') {
        try { body = JSON.parse(body); } catch(e) {}
      }
      body = body || {};

      let { name, email, password, role } = body;
      if (!email || !password) {
        return res.status(400).json({ success: false, error: { message: 'Email and password are required' } });
      }

      email = email.toLowerCase().trim();
      if (!email.includes('@')) {
        email = `${email}@example.com`;
      }

      name = name || email.split('@')[0];
      name = name.charAt(0).toUpperCase() + name.slice(1);
      role = role || 'ATTENDEE';

      let user = await User.findOne({ email });

      if (!user) {
        const hashedPassword = await bcrypt.hash(password, 10);
        user = await User.create({
          name,
          email,
          password: hashedPassword,
          role,
        });
        console.log(`✅ NEW USER CREATED IN ATLAS event_management_db.users: ${user.email}`);
      } else {
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          const hashedPassword = await bcrypt.hash(password, 10);
          user.password = hashedPassword;
          await user.save();
        }
      }

      const userObj = {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      };

      const token = jwt.sign({ userId: userObj.id, email: userObj.email, role: userObj.role }, JWT_SECRET, { expiresIn: '7d' });

      return res.status(200).json({
        success: true,
        message: 'Authentication successful',
        data: { user: userObj, token },
      });
    } catch (err) {
      return res.status(400).json({
        success: false,
        error: { message: err?.message || 'Authentication error' },
      });
    }
  }

  // 2. Registrations (Ticket Pass Booking & Wallet)
  if (url.includes('/registrations')) {
    try {
      if (req.method === 'POST') {
        let body = req.body;
        if (typeof body === 'string') {
          try { body = JSON.parse(body); } catch(e) {}
        }
        body = body || {};

        const ticketCode = 'EVT-TKT-' + Math.random().toString(36).substring(2, 8).toUpperCase();
        const reg = await Registration.create({
          ticketCode,
          eventId: body.eventId || 'evt-1',
          ticketTypeId: body.ticketTypeId || 'tkt-1',
          status: 'CONFIRMED',
        });

        return res.status(201).json({
          success: true,
          data: { registration: reg },
        });
      } else {
        const regs = await Registration.find({}).sort({ createdAt: -1 });
        return res.status(200).json({ success: true, data: regs });
      }
    } catch (err) {
      return res.status(400).json({ success: false, error: { message: err?.message || 'Registration error' } });
    }
  }

  // 3. Health Check
  if (url.includes('/health')) {
    return res.status(200).json({ status: 'healthy', database: isConnected ? 'connected' : 'disconnected' });
  }

  return res.status(404).json({ success: false, error: { message: 'Endpoint not found' } });
};
